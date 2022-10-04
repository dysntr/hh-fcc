import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { InputField } from "./InputField.js"
import { Input } from "web3uikit"
import Output from "./Output.js"
import Header from "./Header.js"

export default function Storage() {
    //const contractAddress = document.getElementById("contractAddress").value

    const [contractAddress, setContractAddress] = useState(
        "0xb29ea9ad260b6dc980513bba29051570b2115110"
    )
    const [startLocation, setStartLocation] = useState(0)

    const [storageContent, setStorageContent] = useState("")
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()

    async function getStorage() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        console.log("Logging storage...")
        let storageContent_ = "Getting Storage Slots for Contract " + contractAddress + "...\n"
        console.log("Start Location:", startLocation)
        const x = parseInt(startLocation)
        for (let i = x; i < x + 10; i++) {
            const _results = await provider.getStorageAt(contractAddress, i)
            storageContent_ += "Location " + i + ": " + _results + "\n"
        }
        setStorageContent(storageContent_)
    }

    async function updateUIValues() {
        await getStorage()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleChangeAddress = (e) => {
        setContractAddress(e.target.value)
        console.log(e.target.value)
    }

    const handleChangeLocation = (e) => {
        setStartLocation(e.target.value)
        console.log(e.target.value)
    }

    return (
        <nav className="p-5 border-b-2 flex flex-row ">
            <div className="mr-auto py-2 px-4 ">
                <label>Contract Address:</label>
                <input
                    className="bg-gray-800 hover:bg-gray-500 font-bold py-2 px-4 rounded mt-2 ml-2 text-white"
                    type="text"
                    value={contractAddress}
                    placeholder="0x"
                    label="Contract Address"
                    onChange={handleChangeAddress}
                    size="40"
                />
                <label className="ml-5">Start Location:</label>
                <input
                    className="bg-gray-800 hover:bg-gray-500 font-bold py-2 px-4 rounded mt-2 ml-2 text-white"
                    type="text"
                    value={startLocation}
                    placeholder="0"
                    label="Start Location"
                    onChange={handleChangeLocation}
                    size="10"
                />
                {isWeb3Enabled ? (
                    <div>
                        <button
                            id="getStorageButton"
                            onClick={getStorage}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mt-2"
                        >
                            Get Storage
                        </button>
                    </div>
                ) : (
                    <div>Please connect to a chain </div>
                )}
                <Output text={storageContent} />
            </div>
        </nav>
    )
}
