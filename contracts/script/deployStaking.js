const { ethers } = require("hardhat");

async function main() {
    // get network name from hardhat runtime environment
    const networkName = hre.network.name;
    console.log("Network:", networkName);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    let stakingToken = "";
    let rewardsToken = "";
  
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    const stakingRewards = await StakingRewards.deploy(rewardsToken, stakingToken);
    await stakingRewards.waitForDeployment();
    console.log("StakingRewards deployed to:", await stakingRewards.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });