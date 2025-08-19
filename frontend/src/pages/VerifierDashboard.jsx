import React, { useState } from "react";

const DUMMY_STATS = {
  total: 50,
  valid: 45,
  invalid: 5,
};

function VerificationResult({ result }) {
  if (result === null)
    return (
      <div>
        <p>No verification results found. Enter a certificate ID above to verfiy a certificate</p>
      </div>
    );

  if (result.valid)
    return (
      <div>
        {/* Header */}
        <div>
          <svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24">
            <rect x="6" y="3" width="12" height="18" rx="2" fill="none" />
            <path d="M9 7h6M9 11h6M9 15h3" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <h2> Verification Result</h2>
        </div>

        {/* Certificate Status */}
        <div>
          <div>
            <svg width="24" height="24" fill="none" stroke="#15803d" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="#15803d" stroke-width="2" fill="none" />
              <path d="M9.5 12.5l2 2 4-4" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>
            <span>Valid Certificate</span>
          </div>

          {/* Details */}
          <div>
            <div>
              <span>Issuer:</span>
              <span>Federal University of Technology, Owerri (FUTO)</span>
            </div>

            <div>
              <span>Recipient:</span>
              <span>Smith Divine</span>
            </div>

            <div>
              <span>Program:</span>
              <span>Computer Science</span>
            </div>

            <div>
              <span>Date Issuued:</span>
              <span>2023-12-15</span>
            </div>
          </div>

          <hr />
          <div>
            <span>CGPA</span>
            <span>4.5</span>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div>
        <svg width="20" height="20" fill="none" stroke="#2563eb" stroke-width="1.5" viewBox="0 0 24 24">
          <rect x="6" y="3" width="12" height="18" rx="2" fill="none" />
          <path d="M9 7h6M9 11h6M9 15h3" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <h2> Verification Result</h2>
      </div>

      {/* Invalid Certificate Status */}
      <div>
        <div>
          <svg width="24" height="24" fill="none" stroke="#b91c1c" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="#b91c1c" strokeWidth="2" fill="none" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span>Invalid Certificate</span>
        </div>
      </div>
    </div>
  );
};

export default function VerifierDashboard() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (input === "mmm") {
      setResult({ valid: true });
    } else if (input) {
      setResult({ valid: false });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="p-12">
      <div className="text-4xl font-bold text-gray-900 mb-2">My Verifications</div>
      <div className="text-gray-500 mb-8 text-lg">Manage and track your certificate verification activities</div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 rounded-lg flex flex-col items-center justify-center py-10">
          <div className="text-gray-900 text-lg font-semibold mb-2">Total Verifications</div>
          <div className="text-4xl font-bold">{DUMMY_STATS.total}</div>
        </div >
        <div className="bg-green-500 rounded-lg flex flex-col items-center justify-center py-10">
          <div className="text-white text-lg font-semibold mb-2">Valid</div>
          <div className="text-4xl font-bold text-white flex items-center">
            {DUMMY_STATS.valid}
            <span className="ml-2 text-3xl">✔</span>
          </div>
        </div>
        <div className="bg-orange-500 rounded-lg flex flex-col items-center justify-center py-10">
          <div className="text-white text-lg font-semibold mb-2">Invalid</div>
          <div className="text-4xl font-bold text-white flex items-center">
            {DUMMY_STATS.invalid}
            <span className="ml-2 text-3xl">✖</span>
          </div>
        </div>
      </div >
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="font-bold text-2xl mb-4 flex items-center">
            <span className="mr-2 text-xl text-green-700">🔍</span> Certificate Verification
          </div>
          <form onSubmit={handleVerify}>
            <label className="block mb-2 text-gray-700 font-semibold">Certificate ID/Link</label>
            <input
              className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter certificate ID or paste certificate link"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3 rounded transition text-lg"
            >
              <span className="mr-2">🔍</span> Verify Certificate
            </button>
          </form>
        </div>
        <div>
          <div className="font-bold text-2xl mb-4 flex items-center">
            <span className="mr-2 text-xl">📝</span> Verification Result
          </div>
          <div>
            <VerificationResult result={result} />
          </div>
        </div>
      </div>
    </div >
  );
}