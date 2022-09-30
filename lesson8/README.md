# Lesson 8: HTML / Javascript Fund Me (Full Stack / Front End)

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-8-html--javascript-fund-me-full-stack--front-end)

### Useful Links

- docs.ethers.io/v5/getting-started
-

## My Notes

- Building a DAPP usually requires 2 repos:

  - One for the smart contracts
  - One for the front end / website

- Wallets inject code in the browser

  - window object - current window object for browser
  - window.ethereum - exists when a web3 wallet is installed
  - Wallets have a blockchain node inside of them.

- Build the website with HTML / Javascript
  - Later on, we will use Nextjs /Reactjs

### VSCode shortcut

- If you type `!` and click the first thing that appears, vscode will fill a template of html code for you.

### VSCode Extension

- Live Server - allows us to easily spin up a html website
- You will get a Go Live! button on bottom of vscode.
- `.vscode` folder allows you to make settings specifically for your application
  - `settings.json` - `{"liveServer.settings.port": 5501}`

### http-server

- `yarn add --dev http-server`
- Allows you to serve http
- `yarn http-server` will host your html file

### Connecting HTML to metamask

- You can add js scripts to html file `<script src="./index.js" type="text/javascript"></script>`
  - if it contains imports, then it needs to be `<script src="./index.js" type="module"></script>`
- Here is the code to connect to a wallet:

  ```js
  import { ethers } from "./ethers-5.6.esm.min.js";
  const connectButton = document.getElementById("connectButton");
  connectButton.onclick = connect;

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
  ```

- You can add buttons in html as follow `<button id="connectButton" onclick="connect()">Connect</button>`
- If you're using imports (i.e. `type="module"`) you would have to add your buttons in the JS code

  ```js
  const connectButton = document.getElementById("connectButton");
  const fundButton = document.getElementById("fundButton");
  connectButton.onclick = connect;
  fundButton.onclick = fund;
  ```

- Your html code for buttons would look like this
  ```html
  <button id="connectButton">Connect</button>
  <button id="fundButton">Fund</button>
  ```

### ES6 vs NodeJS

- nodeJs uses `require`
- front-end js can't use require, use `import`
  - download the ethers.js to your webapp folder, and then import it in your .js file `import { ethers } from "./ethers-5.6.esm.min.js";`
  - Add to your html, `<script src="./index.js" type="module"></script>`

### Things you need to call a contract

- provider /connection to blockchain
- singer/wallet someone with some gas
- contract that we're interacting with
  - ABI & Address

```js
//provider /connection to blockchain
const provider = new ethers.providers.Web3Provider(window.ethereum);

//singer/wallet someone with some gas
const signer = provider.getSigner();

//contract that we're interacting with
//ABI & Address
const contract = new ethers.Contract(contractAddress, abi, signer);
```

### Signing a transaction from the website

- Abis are located in `/artifcats/contracts/Contract_Name.sol/Contract_Name.json`
- You can add abi to constant.js file using `export const abi = []` and copying the abi from the .json file
  - Back in index.js you can `import {abi, contractAddress} from "./constants.js"`
- You can add your contract address to constants.js `export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"`
- After creating the contract, you can send a transaction as follow:

```js
const transactionResponse = await contract.fund({
  value: ethers.utils.parseEther(ethAmount),
});
```

### Adding Hardhat localhost network to metamask

- Open metamask and add `Hardhat-localhost`
- Network Name: `Hardhat-Localhost`
- New RPC URL: `http://127.0.0.1:8545/` (you get it from yarn hardhat node output)
- Chain Id: `31337`
- Currency Symbol: `ETH`
- Block Explorer: ``

### How to fix "expected nonce to be x but got y"

- Reason it happens, is that you restarted hardhat node, hardhat nonce is 0, but metamask isn't smart enough to know that
- To fix: Go to Metamask Settings > Advanced > Click Reset Account

### How do you know when the transaction is mined

- listen for tx to be mined
- listen for an event
- You can use this function to listen for tx to be mined

  - not an async function
  - returns a promise
    - create a listener for the blocker
    - use `await listenForTransactionMine(transactionResponse, provider);` to wait for this function to complete prior to proceeding

- `provider.once` listen for an event (or `provider.on` to fire every time)
- this code uses promises to ensure the `await listenForTransactionMine(transactionResponse, provider);` actually waits till promises resolves

```js
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  //only finish this function once provider.once is found.
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
```

### Input form

- In html code add

```html
<!--form-->
<label for="fund">ETH Amount</label>
<input id="ethAmount" placeholder="0.1" />
<!--form-->
```

- In JS code add

```js
const ethAmount = document.getElementById("ethAmount").value;
```

- To format the ethers you can use `console.log(ethers.utils.formatEther(balance));`
