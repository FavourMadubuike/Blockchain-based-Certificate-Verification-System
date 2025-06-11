const hre = require("hardhat");

async function main() {
  const CertificateManager = await hre.ethers.getContractFactory("CertificateManager");
  const certificateManager = await CertificateManager.deploy();

  await certificateManager.deployed();
  console.log("CertificateManager deployed to:", certificateManager.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});