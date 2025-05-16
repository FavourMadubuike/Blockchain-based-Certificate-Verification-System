# Blockchain-based Certificate Verification System Design

## System Overview
This system enables FUTO to issue, manage, and verify academic certificates securely using Ethereum’s Sepolia testnet blockchain. FUTO Senate issues certificates, graduates view and share them, and third parties verify their authenticity.

## Technology Stack
- **Frontend**: React.js with Tailwind CSS
  - Single-page app, responsive UI, JSX components.
  - CDN-hosted dependencies (e.g., cdn.jsdelivr.net).
- **Backend**: Node.js with Express.js
  - RESTful API for users, certificates, blockchain.
  - MongoDB for metadata storage.
  - JWT for authentication.
- **Blockchain**: Ethereum (Sepolia testnet)
  - Smart contracts for issuance, verification, revocation.
  - Hardhat for development and deployment.
  - MetaMask for issuer transactions (Sepolia faucet ETH).
- **Database**: MongoDB
  - Stores issuer, recipient, verifier, certificate data.
- **Other Tools**:
  - Web3.js or Ethers.js for blockchain.
  - Bcrypt for password hashing.

## System Interface and Features

### 1. Login Page
**Purpose**: Authenticate users (Issuer, Recipient, Verifier).
**Interface Components**:
- Dropdown: Issuer, Recipient, Verifier.
- Username/Email: Username (Issuers), JAMB number (Recipients).
- Password: Custom (Issuers), JAMB number (Recipients), custom (Verifiers).
- "Login" button.
- "Sign Up" and "Forgot Password" links (Verifiers only).
**Flow**:
- Issuers: Use pre-created username/password.
- Recipients: Use JAMB number.
- Verifiers: Use email/password.
- Redirects to dashboards.
**UI Design**: FUTO green/white palette, gradient mix (green-like/white-like), responsive, with FUTO logo.

### 2. Issuer Dashboard (FUTO Senate)
**Purpose**: Issue and manage blockchain certificates.
**Interface Components**:
- **Navigation**: Home, Issue Certificate, Manage Certificates, Profile Settings, Logout.
- **Features**:
  - **Issue Certificate**:
    - Form: Recipient Name, Matric No., Program, Graduation Date, File Upload.
    - Generates SHA-256 hash; signs via MetaMask (Sepolia).
    - Stores metadata/hash on blockchain; file in MongoDB.
    - "Submit" button.
  - **Manage Certificates**:
    - Table: Certificate ID, Recipient Name, Issue Date, Status.
    - Search: Filter by ID/Name.
    - Revoke option.
  - **Profile Settings**: View Name, Username, Email, Department, Senate Role.
**Backend Logic**:
- Pre-loaded issuer data in MongoDB (hashed passwords).
- Issuance triggers Sepolia smart contract.
- MongoDB stores metadata.
**UI Design**: FUTO green/white gradient, intuitive.

### 3. Recipient Dashboard (FUTO Graduate)
**Purpose**: View/share blockchain certificates.
**Interface Components**:
- **Navigation**: My Certificates, Profile Settings, Logout.
- **Features**:
  - **My Certificates**:
    - List: Certificate ID, Program, Issue Date.
    - Details: Issuer, Program, Date, Status.
    - "Download" (MongoDB) and "Share" (link) buttons.
    - Status: Green "Verified" or Red "Not Verified".
  - **Profile Settings**: View Name, JAMB Number, Program.
**Backend Logic**:
- Recipient data pre-loaded from admission list.
- Login validates JAMB number (no hashing).
- Certificates from MongoDB; hashes validated on Sepolia.
**UI Design**: Simple, green/white gradient, student-friendly.

### 4. Verifier Dashboard (Employers/Third Parties)
**Purpose**: Verify certificates via blockchain.
**Interface Components**:
- **Navigation**: Verify Certificate, Profile Settings, Logout.
- **Features**:
  - **Verify Certificate**:
    - Input: Certificate ID/link.
    - "Verify" button.
    - Shows: Issuer, Recipient, Program, Date.
    - Status: Green "Valid" or Red "Invalid".
  - **Profile Settings**: Update Name, Organization, Email, Password.
**Backend Logic**:
- Verifiers use email/password (Bcrypt-hashed).
- Verification queries Sepolia contract.
- MongoDB stores profiles.
**UI Design**: Minimalist, green/white gradient.

### 5. Signup Page (Verifiers Only)
**Purpose**: Register verifiers.
**Interface Components**:
- Email, Password, Confirm Password, Organization (optional).
- "Sign Up" button, "Back to Login" link.
**Flow**:
- Validates email/password.
- Stores hashed password in MongoDB.
- Redirects to dashboard.
**UI Design**: Simple, green/white gradient.

## Actors and Key Functionalities
| **Actor**     | **Functionalities**                                                                 |
|---------------|-------------------------------------------------------------------------------------|
| **Issuer**    | Issue, manage, revoke certificates on blockchain.                                    |
| **Recipient** | View, download, share certificates; check status.                                    |
| **Verifier**  | Verify certificates, manage profile.                                                 |

## Blockchain Integration
- **Smart Contract** (Hardhat):
  - Functions: Issue, verify, revoke certificates.
  - Deployed on Sepolia testnet (free via faucet ETH).
- **Process**:
  - Issuer: Uploads file, generates hash, signs via MetaMask.
  - Contract: Stores hash/metadata.
  - Verifier: Queries contract for validation.
- **Storage**:
  - Files: MongoDB.
  - Metadata/Hash: Sepolia and MongoDB.
- **Hardhat**:
  - Compile, test, deploy to Sepolia.
  - Use Alchemy/Infura node provider.

## Database Schema (MongoDB)
- **Issuers**:
  ```json
  {
    _id: ObjectId,
    name: String,
    username: String,
    password: String (hashed),
    email: String,
    department: String,
    senateRole: String,
    role: "issuer",
    createdAt: Date
  }
  ```
- **Recipients**:
  ```json
  {
    _id: ObjectId,
    name: String,
    jambRegNumber: String,
    program: String,
    role: "recipient",
    createdAt: Date
  }
  ```
- **Verifiers**:
  ```json
  {
    _id: ObjectId,
    name: String,
    email: String,
    password: String (hashed),
    organization: String (optional),
    role: "verifier",
    createdAt: Date
  }
  ```
- **Certificates**:
  ```json
  {
    _id: ObjectId,
    certificateID: String,
    recipientID: ObjectId,
    issuerID: ObjectId,
    program: String,
    graduationDate: Date,
    certificateHash: String,
    fileURL: String (MongoDB),
    status: String ("active", "revoked"),
    createdAt: Date
  }
  ```

## Security Considerations
- **Authentication**:
  - Issuers: Username, Bcrypt-hashed password.
  - Recipients: JAMB number (no hashing).
  - Verifiers: JWT, Bcrypt-hashed password.
- **Blockchain**: Immutable Sepolia hashes.
- **Privacy**: Encrypt MongoDB sensitive data.
- **Access**: Role-based controls.

## Deployment
- **Frontend**: Vercel/Netlify.
- **Backend**: Heroku.
- **Blockchain**: Sepolia testnet via Hardhat.
- **Database**: MongoDB Atlas (free tier).
- **Sepolia**: Free ETH via faucet; Alchemy/Infura node.

## Project Notes
- **Scope**: Streamlined for FUTO final-year project.
- **Branding**: FUTO green/white gradient, logo, Senate issuer data.
- **Cost**: Free-tier tools (Sepolia, Heroku, MongoDB Atlas).