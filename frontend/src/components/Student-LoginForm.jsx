import React, {useState} from 'react';

const StudentLoginForm = ({ onLogin, onCancel}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Student login successful! (Redirect to dashboard)');
        onLogin();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="text" name="name" id="" placeholder="Name" required />
            <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="text" name="regno" id="" placeholder="JAMB Reg No" required />
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" type="submit">Login</button>
            <button className="bg-red-500 text-white px-0 py-1 rounded hover:bg-red-600" type="button" onClick={onCancel}>Cancle</button>
        </form>
    );
};

export default StudentLoginForm;