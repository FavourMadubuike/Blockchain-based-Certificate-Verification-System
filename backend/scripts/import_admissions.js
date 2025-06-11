const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Recipient = require("../models/Recipient");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const importData = async () => {
  try {
    // Validate environment variable
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Drop the recipients collection
    try {
      await Recipient.collection.drop();
      console.log("Dropped recipients collection");
    } catch (err) {
      if (err.codeName === "NamespaceNotFound") {
        console.log("Recipients collection does not exist, proceeding with import");
      } else {
        throw new Error(`Failed to drop recipients collection: ${err.message}`);
      }
    }

    // Define JSON file path
    const jsonPath = path.resolve(__dirname, "../admission_list.json");
    console.log("Attempting to read:", jsonPath);

    // Read JSON file
    let data;
    try {
      data = await fs.readFile(jsonPath, "utf-8");
      console.log("JSON file read successfully");
    } catch (err) {
      throw new Error(`Failed to read admission_list.json: ${err.message}`);
    }

    // Parse JSON
    let students;
    try {
      students = JSON.parse(data);
      console.log(`Parsed ${students.length} student records`);
    } catch (err) {
      throw new Error(`Failed to parse admission_list.json: ${err.message}`);
    }

    // Validate JSON data
    if (!Array.isArray(students)) {
      throw new Error("admission_list.json must contain an array");
    }
    if (students.length === 0) {
      throw new Error("admission_list.json is empty");
    }

    // Map student data with error handling
    const recipients = [];
    const errors = [];
    for (let index = 0; index < students.length; index++) {
      const student = students[index];
      try {
        if (!student.jamb_reg_number) {
          throw new Error(`Missing jamb_reg_number at index ${index}`);
        }
        recipients.push({
          generalSerialNumber: String(student.general_serial_number || ""),
          departmentSerialNumber: String(student.department_serial_number || ""),
          name: String(student.fullname || ""),
          jambRegNumber: student.jamb_reg_number,
          password: await bcrypt.hash(student.jamb_reg_number, 10),
          gender: String(student.gender || ""),
          state: String(student.state || ""),
          lga: String(student.lga || ""),
          modeOfAdmission: String(student.mode_of_admission || ""),
          program: String(student.programme || ""),
          role: "recipient",
          createdAt: new Date(),
        });
      } catch (err) {
        errors.push(`Error processing student at index ${index}: ${err.message}`);
      }
    }

    if (errors.length > 0) {
      console.error("Mapping errors:", errors.join("\n"));
      if (recipients.length === 0) {
        throw new Error("No valid records to insert");
      }
      console.log(`Proceeding with ${recipients.length} valid records`);
    } else {
      console.log("Successfully mapped all records");
    }

    // Insert into MongoDB
    try {
      const result = await Recipient.insertMany(recipients, { ordered: false });
      console.log(`Inserted ${result.length} recipient records into MongoDB`);
    } catch (err) {
      throw new Error(`Failed to insert records: ${err.message}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error importing data:", err.message);
    process.exit(1);
  }
};

importData();