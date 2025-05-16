import { useState } from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-800">
          Welcome to FUTO Certificate Verification System
        </h1>
      </main>
    </div>
  );
}

export default App;