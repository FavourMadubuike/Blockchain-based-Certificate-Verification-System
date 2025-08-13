// backend/testProvider.js
const { ethers } = require("ethers");
require("dotenv").config();

async function testProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const blockNumber = await provider.getBlockNumber();
  console.log("Connected to Sepolia, block number:", blockNumber);
}

testProvider().catch(console.error);