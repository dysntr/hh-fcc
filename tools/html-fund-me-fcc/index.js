import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const getStorageButton = document.getElementById("getStorageButton");
getStorageButton.onclick = getStorage;

const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;

const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
  } else {
    connectButton.innerHTML = "Please install metamask!";
  }
}

async function getStorage() {
  const contractAddress = document.getElementById("contractAddress").value;

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(`Getting Storage Slots for Contract ${contract.address}...`);

    console.log(ethers);
    console.log(
      "Logging storage...",
      await ethers.provider.getStorageAt(contract.address, 0)
    );

    for (let i = 0; i < 10; i++) {
      console.log(
        `Location ${i}: ${await ethers.provider.getStorageAt(
          contract.address,
          i
        )}`
      );
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}
