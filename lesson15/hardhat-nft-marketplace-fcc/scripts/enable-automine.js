const { network } = require("hardhat")

async function autoMine() {
    console.log("Setting network to automine ...")
    await network.provider.send("evm_setAutomine", [true])
    await network.provider.send("evm_setIntervalMining", [500])
    console.log("Set network to automine ...")
}

module.exports = {
    autoMine,
}
