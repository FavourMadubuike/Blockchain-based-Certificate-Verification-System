const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Issuer = require('../models/Issuer');
const Certificate = require('../models/Certificate');
const Recipient = require('../models/Recipient');
const router = express.Router();
const ethers = require('ethers');
const CertificateManagerABI = require('../contracts/CertificateManagerABI.json');

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPG are allowed.'));
    }
  },
});

// Connect to Sepolia (for verification only)
const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
);
const contract = process.env.CONTRACT_ADDRESS
  ? new ethers.Contract(process.env.CONTRACT_ADDRESS, CertificateManagerABI, provider)
  : null;

// Middleware to verify issuer JWT
const verifyIssuer = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (decoded.role !== 'issuer') {
      console.log('Access denied: issuer role required');
      return res.status(403).json({ message: 'Access denied: issuer role required' });
    }
    req.user = { id: decoded.id.toString(), role: decoded.role, department: decoded.department, senateRole: decoded.senateRole };
    console.log('req.user set:', req.user);
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Validate blockchain configuration
const validateBlockchainConfig = async (res) => {
  if (!process.env.SEPOLIA_RPC_URL) {
    res.status(500).json({ message: 'Server error: SEPOLIA_RPC_URL not configured' });
    return false;
  }
  if (!process.env.CONTRACT_ADDRESS) {
    res.status(500).json({ message: 'Server error: CONTRACT_ADDRESS not configured' });
    return false;
  }
  if (!contract) {
    res.status(500).json({ message: 'Server error: Blockchain contract not initialized' });
    return false;
  }
  return true;
};

// Check Certificate ID Uniqueness
router.post('/check-certificate-id', verifyIssuer, async (req, res) => {
  const { certificateID } = req.body;
  if (!certificateID) {
    console.error('Missing certificateID');
    return res.status(400).json({ message: 'Missing certificateID' });
  }

  if (!await validateBlockchainConfig(res)) return;

  try {
    const certificateIdBytes32 = ethers.id(certificateID);
    let existingCert;
    for (let attempt = 1; attempt <= 3; attempt++) {
      existingCert = await contract.certificates(certificateIdBytes32);
      console.log(`Checking certificateID (attempt ${attempt}):`, {
        certificateID,
        issueDate: existingCert.issueDate.toString(),
        exists: existingCert.issueDate !== 0n,
      });
      if (existingCert.issueDate !== 0n) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    res.status(200).json({ exists: existingCert.issueDate !== 0n });
  } catch (err) {
    console.error('Error checking certificateID:', err);
    res.status(500).json({ message: 'Failed to check certificateID', error: err.message });
  }
});

// Issuer Login
router.post('/auth/login', async (req, res) => {
  console.log('POST /api/issuers/auth/login hit', req.body);
  const { username, password } = req.body;
  try {
    const issuer = await Issuer.findOne({ username });
    console.log('Issuer found:', issuer ? issuer.username : 'None');
    if (!issuer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, issuer.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: issuer._id, role: issuer.role, department: issuer.department, senateRole: issuer.senateRole },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Token generated for:', issuer.username);
    res.status(200).json({
      token,
      user: {
        id: issuer._id,
        username: issuer.username,
        name: issuer.name,
        email: issuer.email,
        role: issuer.role,
        department: issuer.department,
        senateRole: issuer.senateRole,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Issuer Profile
router.get('/profile', verifyIssuer, async (req, res) => {
  try {
    const issuer = await Issuer.findById(req.user.id).select('name username email department senateRole role');
    if (!issuer) {
      return res.status(404).json({ message: 'Issuer not found' });
    }
    res.status(200).json({
      id: issuer._id.toString(),
      name: issuer.name,
      username: issuer.username,
      email: issuer.email,
      department: issuer.department || 'Unknown',
      senateRole: issuer.senateRole || 'Unknown',
      role: issuer.role,
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Authorize Wallet
router.post('/authorize-wallet', verifyIssuer, async (req, res) => {
  console.log('POST /api/issuers/authorize-wallet received:', req.body);
  if (!await validateBlockchainConfig(res)) return;

  const { walletAddress } = req.body;

  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    console.log('Invalid wallet address:', walletAddress);
    return res.status(400).json({ message: 'Invalid wallet address' });
  }

  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new ethers.Contract(process.env.CONTRACT_ADDRESS, CertificateManagerABI, wallet);
    const isAuthorized = await contractWithSigner.authorizedIssuers(walletAddress);
    if (isAuthorized) {
      console.log(`Wallet ${walletAddress} already authorized`);
      return res.status(200).json({ message: 'Wallet already authorized', transactionHash: null });
    }

    console.log(`Authorizing wallet: ${walletAddress}`);
    const tx = await contractWithSigner.authorizeIssuer(walletAddress, { gasLimit: 100000 });
    const receipt = await tx.wait();
    console.log(`Wallet ${walletAddress} authorized. Transaction hash: ${tx.hash}`);

    res.status(200).json({ message: 'Wallet authorized successfully', transactionHash: tx.hash });
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ message: 'Failed to authorize wallet', error: err.message });
  }
});

// Issue Certificate (MongoDB and file system storage)
router.post('/issue', verifyIssuer, upload.single('certificateFile'), async (req, res) => {
  const { recipientID, program, graduationDate, certificateHash, certificateID, transactionHash } = req.body;
  const fileBuffer = req.file?.buffer;
  const fileType = req.file?.mimetype.split('/')[1];

  console.log('Received /issue request with:', {
    recipientID,
    program,
    graduationDate,
    certificateHash,
    certificateID,
    transactionHash,
    hasFile: !!fileBuffer,
    issuerID: req.user.id,
  });

  // Strict validation
  if (!recipientID || !program || !graduationDate || !certificateHash || !certificateID || !transactionHash || !fileBuffer) {
    console.log('Missing fields:', { recipientID, program, graduationDate, certificateHash, certificateID, transactionHash, hasFile: !!fileBuffer });
    return res.status(400).json({ message: 'Missing required fields', received: { recipientID, program, graduationDate, certificateHash, certificateID, transactionHash, hasFile: !!fileBuffer } });
  }

  if (!mongoose.Types.ObjectId.isValid(recipientID)) {
    console.error('Invalid recipientID format:', recipientID);
    return res.status(400).json({ message: 'Invalid recipientID format', recipientID });
  }

  if (!ethers.isHexString(certificateHash, 32)) {
    console.error('Invalid certificateHash format:', certificateHash);
    return res.status(400).json({ message: 'Invalid certificateHash format, must be 32-byte hex string' });
  }

  if (!ethers.isHexString(transactionHash)) {
    console.error('Invalid transactionHash format:', transactionHash);
    return res.status(400).json({ message: 'Invalid transactionHash format' });
  }

  if (!await validateBlockchainConfig(res)) return;

  try {
    // Validate recipient
    const recipient = await Recipient.findById(recipientID);
    if (!recipient) {
      console.error('Recipient not found for ID:', recipientID);
      return res.status(404).json({ message: 'Recipient not found', recipientID });
    }

    console.log('Recipient found:', {
      id: recipient._id.toString(),
      name: recipient.name,
      jambRegNumber: recipient.jambRegNumber,
    });

    // Validate graduation date
    const parsedGraduationDate = new Date(graduationDate);
    if (isNaN(parsedGraduationDate)) {
      console.error('Invalid graduationDate format:', graduationDate);
      return res.status(400).json({ message: 'Invalid graduationDate format', graduationDate });
    }

    // Check for future date
    const currentDate = new Date();
    if (parsedGraduationDate > currentDate) {
      console.error('Graduation date is in the future:', graduationDate);
      return res.status(400).json({ message: 'Graduation date cannot be in the future' });
    }

    // Verify blockchain transaction
    const certificateIdBytes32 = ethers.id(certificateID);
    let existingCert;
    try {
      existingCert = await contract.certificates(certificateIdBytes32);
      console.log('Blockchain certificate check:', {
        certificateID,
        issueDate: existingCert.issueDate.toString(),
        exists: existingCert.issueDate !== 0n,
      });
      if (existingCert.issueDate === 0n) {
        console.error('Certificate not found on blockchain:', certificateID);
        return res.status(400).json({ message: 'Certificate not found on blockchain' });
      }
      if (existingCert.certificateHash !== certificateHash || existingCert.jambRegNumber !== recipient.jambRegNumber || existingCert.program !== program) {
        console.error('Blockchain data mismatch:', {
          expected: { certificateHash, jambRegNumber: recipient.jambRegNumber, program },
          found: { certificateHash: existingCert.certificateHash, jambRegNumber: existingCert.jambRegNumber, program: existingCert.program },
        });
        return res.status(400).json({ message: 'Blockchain data mismatch' });
      }
    } catch (err) {
      console.error('Error checking certificate existence:', err);
      return res.status(500).json({ message: 'Failed to verify certificate on blockchain', error: err.message });
    }

    // Verify transaction hash
    try {
      const tx = await provider.getTransactionReceipt(transactionHash);
      if (!tx || tx.status !== 1) {
        console.error('Invalid or failed transaction:', transactionHash);
        return res.status(400).json({ message: 'Invalid or failed blockchain transaction' });
      }
      console.log('Transaction verified:', transactionHash);
    } catch (err) {
      console.error('Error verifying transaction:', err);
      return res.status(500).json({ message: 'Failed to verify transaction hash', error: err.message });
    }

    // Ensure Uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'Uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log('Uploads directory ensured:', uploadsDir);
    } catch (err) {
      console.error('Failed to create Uploads directory:', err);
      return res.status(500).json({ message: 'Failed to create Uploads directory', error: err.message });
    }

    // Save file to /Uploads
    let filePath = null;
    const extension = fileType === 'pdf' ? 'pdf' : fileType === 'png' ? 'png' : 'jpg';
    filePath = path.join(uploadsDir, `${certificateID}.${extension}`);
    try {
      await fs.writeFile(filePath, fileBuffer);
      console.log('File saved to:', filePath);
    } catch (err) {
      console.error('File write error:', err);
      return res.status(500).json({ message: 'Failed to save certificate file', error: err.message });
    }

    // Save to MongoDB
    try {
      const newCertificate = new Certificate({
        certificateID,
        recipientID,
        program,
        graduationDate: parsedGraduationDate,
        status: 'active',
        certificateHash,
        fileBuffer,
        filePath: `/Uploads/${certificateID}.${extension}`,
        fileType: fileType || null,
        issuerID: req.user.id,
        transactionHash,
        createdAt: new Date(),
      });

      console.log('Preparing to save certificate:', {
        certificateID,
        recipientID,
        program,
        graduationDate: parsedGraduationDate,
        status: 'active',
        certificateHash,
        filePath: `/Uploads/${certificateID}.${extension}`,
        fileType: fileType || null,
        issuerID: req.user.id,
        transactionHash,
        createdAt: new Date(),
      });

      const savedCertificate = await newCertificate.save();
      console.log('Certificate saved to MongoDB:', {
        certificateID: savedCertificate.certificateID,
        recipientID: savedCertificate.recipientID.toString(),
        issuerID: savedCertificate.issuerID,
        status: savedCertificate.status,
        filePath: savedCertificate.filePath,
        fileType: savedCertificate.fileType,
        transactionHash: savedCertificate.transactionHash,
        createdAt: savedCertificate.createdAt,
      });

      res.status(201).json({ message: 'Certificate issued successfully', certificateID, transactionHash });
    } catch (err) {
      console.error('MongoDB save error:', err);
      try {
        await fs.unlink(filePath);
        console.log('Cleaned up file:', filePath);
      } catch (unlinkErr) {
        console.error('File cleanup error:', unlinkErr);
      }
      return res.status(500).json({ message: 'Failed to save certificate to MongoDB', error: err.message });
    }
  } catch (err) {
    console.error('Server error in /issue:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Certificates
router.get('/certificates', verifyIssuer, async (req, res) => {
  try {
    console.log('Fetching certificates for issuerID:', req.user.id);
    const certificates = await Certificate.find({ issuerID: req.user.id })
      .populate('recipientID', 'name jambRegNumber')
      .select('certificateID recipientID program graduationDate status certificateHash filePath fileType transactionHash createdAt issuerID');
    
    // Manually fetch issuer names
    const issuerIds = [...new Set(certificates.map(c => c.issuerID))];
    const issuers = await Issuer.find({ _id: { $in: issuerIds.map(id => mongoose.Types.ObjectId.createFromHexString(id)) } }).select('name');
    const issuerMap = new Map(issuers.map(i => [i._id.toString(), i.name]));

    console.log('Certificates fetched:', certificates.map(c => ({
      certificateID: c.certificateID,
      recipientName: c.recipientID?.name,
      matricNo: c.recipientID?.jambRegNumber,
      issuerID: c.issuerID,
      issuerName: issuerMap.get(c.issuerID) || 'Unknown',
      filePath: c.filePath,
      transactionHash: c.transactionHash,
      createdAt: c.createdAt,
    })));

    res.status(200).json(certificates.map(c => ({
      certificateID: c.certificateID,
      recipientID: c.recipientID?._id.toString(),
      recipientName: c.recipientID?.name || 'Unknown',
      matricNo: c.recipientID?.jambRegNumber || 'Unknown',
      program: c.program,
      graduationDate: c.graduationDate,
      status: c.status,
      certificateHash: c.certificateHash,
      filePath: c.filePath,
      fileType: c.fileType,
      transactionHash: c.transactionHash,
      createdAt: c.createdAt,
      issuerID: c.issuerID,
      issuerName: issuerMap.get(c.issuerID) || 'Unknown',
    })));
  } catch (err) {
    console.error('Certificates fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify Certificate
router.post('/verify', verifyIssuer, async (req, res) => {
  if (!await validateBlockchainConfig(res)) return;

  const { certificateID, certificateHash } = req.body;
  console.log('Received /verify request:', { certificateID, certificateHash });

  if (!certificateID || !certificateHash) {
    console.error('Missing certificateID or certificateHash');
    return res.status(400).json({ message: 'CertificateID and certificateHash are required' });
  }

  try {
    const certificate = await Certificate.findOne({ certificateID })
      .populate('recipientID', 'name jambRegNumber')
      .select('certificateID recipientID program graduationDate status certificateHash filePath fileType transactionHash issuerID');
    
    if (!certificate) {
      console.error('Certificate not found:', certificateID);
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Fetch issuer name
    const issuer = await Issuer.findById(certificate.issuerID).select('name');

    try {
      const certificateIdBytes32 = ethers.id(certificateID);
      const [onChainHash, jambRegNumber, program, issueDate, issuerAddress, isValid] = await contract.verifyCertificate(certificateIdBytes32);
      console.log('Blockchain verification:', {
        certificateID,
        onChainHash,
        providedHash: certificateHash,
        isValid,
      });
      const certHashBytes = ethers.getBytes(certificateHash);
      const isHashMatch = onChainHash === ethers.hexlify(certHashBytes);
      if (!isValid || !isHashMatch) {
        console.error('Verification failed:', {
          isValid,
          isHashMatch,
          onChainHash,
          providedHash: certificateHash,
        });
        return res.status(400).json({ message: 'Certificate hash does not match blockchain record or certificate is revoked' });
      }
      res.status(200).json({
        message: 'Certificate verified successfully',
        certificate: {
          certificateID: certificate.certificateID,
          recipientName: certificate.recipientID?.name || 'Unknown',
          matricNo: certificate.recipientID?.jambRegNumber || 'Unknown',
          program: certificate.program,
          issueDate: certificate.graduationDate,
          status: certificate.status,
          certificateHash: certificate.certificateHash,
          filePath: certificate.filePath,
          fileType: certificate.fileType,
          transactionHash: certificate.transactionHash,
          issuerName: issuer?.name || 'Unknown',
        },
      });
    } catch (err) {
      console.error('Blockchain verification error:', err);
      return res.status(500).json({ message: 'Blockchain verification error', error: err.message });
    }
  } catch (err) {
    console.error('Server error in /verify:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Revoke Certificate
router.post('/revoke', verifyIssuer, async (req, res) => {
  if (!await validateBlockchainConfig(res)) return;

  const { certificateID } = req.body;
  console.log('Received /revoke request:', { certificateID });

  try {
    const certificate = await Certificate.findOne({ certificateID });
    if (!certificate) {
      console.error('Certificate not found:', certificateID);
      return res.status(404).json({ message: 'Certificate not found' });
    }
    if (certificate.status === 'revoked') {
      console.error('Certificate already revoked:', certificateID);
      return res.status(400).json({ message: 'Certificate already revoked' });
    }

    certificate.status = 'revoked';
    await certificate.save();

    try {
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contractWithSigner = new ethers.Contract(process.env.CONTRACT_ADDRESS, CertificateManagerABI, wallet);
      const certificateIdBytes32 = ethers.id(certificateID);
      const tx = await contractWithSigner.revokeCertificate(certificateIdBytes32, { gasLimit: 300000 });
      await tx.wait();
      console.log(`Certificate ${certificateID} revoked on blockchain: ${tx.hash}`);
    } catch (err) {
      console.error('Blockchain error:', err);
      certificate.status = 'pending';
      await certificate.save();
      return res.status(500).json({ message: 'Blockchain error', error: err.message });
    }

    res.status(200).json({ message: 'Certificate revoked successfully' });
  } catch (err) {
    console.error('Server error in /revoke:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Recipient by ID
router.get('/recipients/:id', verifyIssuer, async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id).select('name jambRegNumber department program');
    if (!recipient) {
      console.error('Recipient not found:', req.params.id);
      return res.status(404).json({ message: 'Recipient not found' });
    }
    res.status(200).json({
      id: recipient._id.toString(),
      name: recipient.name,
      matricNo: recipient.jambRegNumber,
      department: recipient.department || 'Unknown',
      program: recipient.program,
    });
  } catch (err) {
    console.error('Recipient fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search Recipients
router.get('/recipients', verifyIssuer, async (req, res) => {
  const { search } = req.query;
  try {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { jambRegNumber: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const recipients = await Recipient.find(query).select('name jambRegNumber department program');
    console.log('Recipients fetched:', recipients.map(r => ({
      id: r._id.toString(),
      name: r.name,
      matricNo: r.jambRegNumber,
    })));
    res.status(200).json(recipients.map(r => ({
      id: r._id.toString(),
      name: r.name,
      matricNo: r.jambRegNumber,
      department: r.department || 'Unknown',
      program: r.program,
    })));
  } catch (err) {
    console.error('Recipients search error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Download Certificate
router.get('/certificates/:certificateID/download', verifyIssuer, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateID: req.params.certificateID });
    if (!certificate) {
      console.error('Certificate not found:', req.params.certificateID);
      return res.status(404).json({ message: 'Certificate not found' });
    }
    if (certificate.filePath) {
      const fullPath = path.join(__dirname, '..', certificate.filePath);
      try {
        await fs.access(fullPath);
        res.set({
          'Content-Type': certificate.fileType === 'pdf' ? 'application/pdf' : `image/${certificate.fileType}`,
          'Content-Disposition': `attachment; filename="certificate-${certificate.certificateID}.${certificate.fileType}"`,
        });
        res.sendFile(fullPath);
      } catch (err) {
        console.error('File access error:', err);
        return res.status(404).json({ message: 'Certificate file not found on server' });
      }
    } else if (certificate.fileBuffer) {
      res.set({
        'Content-Type': certificate.fileType === 'pdf' ? 'application/pdf' : `image/${certificate.fileType}`,
        'Content-Disposition': `attachment; filename="certificate-${certificate.certificateID}.${certificate.fileType}"`,
      });
      res.send(certificate.fileBuffer);
    } else {
      console.error('Certificate file not found:', req.params.certificateID);
      return res.status(404).json({ message: 'Certificate file not found' });
    }
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;