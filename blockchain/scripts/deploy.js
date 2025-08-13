const hre = require("hardhat");

     async function main() {
       const CertificateManager = await hre.ethers.getContractFactory("CertificateManager");
       const certificateManager = await CertificateManager.deploy();
       
       // Wait for deployment to complete
       const deploymentTx = await certificateManager.waitForDeployment();
       
       // Get the contract address and transaction hash
       const address = await certificateManager.getAddress();
       const txHash = deploymentTx.deploymentTransaction().hash;
       console.log("CertificateManager deployed to:", address);
       console.log("Deployment transaction hash:", txHash);
     }

     main().catch((error) => {
       console.error(error);
       process.exitCode = 1;
     });