import React, {useState} from "react";

const SenateLoginForm = ({onLogin, onCancel}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Senate login successful!');
        onLogin();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="text" name="" id="" placeholder="Senate ID" required />
          <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="password" name="password" id="" placeholder="Password" required />
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" type="submit">Login</button>
          <button className="bg-red-500 text-white px-0 py-1 rounded hover:bg-red-600" type="button" onClick={onCancel}>Cancle</button>  
        </form>
    );
};

export default SenateLoginForm;