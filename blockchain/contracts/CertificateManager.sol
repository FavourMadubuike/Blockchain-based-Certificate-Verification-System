pragma solidity 0.8.28;

contract CertificateManager {
  struct Certificate {
    bytes32 certificateHash;
    string recipientName;
    string program;
    uint256 issueDate;
    address issuer;
    bool isRevoked;
  }

  mapping(bytes32 => Certificate) public certificates;
  mapping(address => bool) public authorizedIssuers;

  event CertificateIssued(bytes32 indexed certificateId, string recipientName, string program, uint256 issueDate, address issuer);
  event CertificateRevoked(bytes32 indexed certificateId, address issuer);
  event IssuerAuthorized(address indexed issuer);
  event IssuerRevoked(address indexed issuer);

  modifier onlyAuthorizedIssuer() {
    require(authorizedIssuers[msg.sender], "Not an authorized issuer");
    _;
  }

  constructor() {
    authorizedIssuers[msg.sender] = true;
    emit IssuerAuthorized(msg.sender);
  }

  function authorizeIssuer(address issuer) external onlyAuthorizedIssuer {
    authorizedIssuers[issuer] = true;
    emit IssuerAuthorized(issuer);
  }

  function revokeIssuer(address issuer) external onlyAuthorizedIssuer {
    authorizedIssuers[issuer] = false;
    emit IssuerRevoked(issuer);
  }

  function issueCertificate(
    bytes32 certificateId,
    bytes32 certificateHash,
    string memory recipientName,
    string memory program,
    uint256 issueDate
  ) external onlyAuthorizedIssuer {
    require(certificates[certificateId].issueDate == 0, "Certificate ID already exists");
    certificates[certificateId] = Certificate({
      certificateHash: certificateHash,
      recipientName: recipientName,
      program: program,
      issueDate: issueDate,
      issuer: msg.sender,
      isRevoked: false
    });
    emit CertificateIssued(certificateId, recipientName, program, issueDate, msg.sender);
  }

  function verifyCertificate(bytes32 certificateId) external view returns (
    bytes32 certificateHash,
    string memory recipientName,
    string memory program,
    uint256 issueDate,
    address issuer,
    bool isValid
  ) {
    Certificate memory cert = certificates[certificateId];
    require(cert.issueDate != 0, "Certificate does not exist");
    return (
      cert.certificateHash,
      cert.recipientName,
      cert.program,
      cert.issueDate,
      cert.issuer,
      !cert.isRevoked
    );
  }

  function revokeCertificate(bytes32 certificateId) external onlyAuthorizedIssuer {
    require(certificates[certificateId].issueDate != 0, "Certificate does not exist");
    require(!certificates[certificateId].isRevoked, "Certificate already revoked");
    require(certificates[certificateId].issuer == msg.sender, "Only issuer can revoke");
    certificates[certificateId].isRevoked = true;
    emit CertificateRevoked(certificateId, msg.sender);
  }
}