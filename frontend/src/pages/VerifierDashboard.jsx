import Navigation from "../components/verifier/Navigation";
import CertificateVerification from "../components/verifier/CertificateVerification";

const VerifierDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Certificate Verification Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Verify blockchain-based certificates on the Sepolia testnet
            </p>
          </div>
          <CertificateVerification />
          <div className="mt-12 p-6 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg border border-accent/30">
            <h2 className="text-lg font-semibold text-foreground mb-3">How to use this dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-1">Search Format</h3>
                <p>Enter a certificate ID (e.g., CERT-123...), recipient name, or JAMB number</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">URL Format</h3>
                <p>Paste a full certificate URL from the issuing institution</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Verification Process</h3>
                <p>Certificates are verified against the Sepolia blockchain</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Security</h3>
                <p>All verifications are cryptographically secure and tamper-proof</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;