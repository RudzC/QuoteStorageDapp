const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const QuoteStorageContractFactory = await hre.ethers.getContractFactory("QuoteStorage");
    const quoteStorageContract = await QuoteStorageContractFactory.deploy();
    await quoteStorageContract.deployed();

    console.log("BankContract deployed to:", quoteStorageContract.address);
    console.log("BankContract owner address:", owner.address)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.log('error', err);
        process.exit(1);
    })
