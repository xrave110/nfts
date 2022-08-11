const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storageImages, storeImages } = require("../utils/uploadToPinata")


const imagesLocation = "./images/randomNfts"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    let tokenUris

    // get IPFS hashes of our images 
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    // 1. With our own IPFS node
    // 2. Pinata
    // 3. NFT storage -> upload to NFT storage

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const tx = await VRFCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2Address
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("-----------------------------------")
    await storeImages(imagesLocation)
    // const args = [vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     //URIS
    //     networkConfig[chainId].mintFee]
}

async function handleTokenUris() {
    tokenUris = []
    // store the image in IPFS
    // store metadata in IPFS
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]