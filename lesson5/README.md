# Lesson 5: Ethers.js Simple Storage

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-5-ethersjs-simple-storage)

### Useful Links

- eth-converter.com - converts between Wei, Gwei, Ether
- faucets.chain.link
- https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html - units and global variables
- solidity-by-example.org
- ethervm.io/decompile to decomplie bytecode to solidity
- [Best README Template](https://github.com/othneildrew/Best-README-Template)

## My Notes

### How to Debug:

1. Tinker and experiment
2. Check the Documentation
3. Doing a web search
4. Ask some questions (stackover flow, stack exchange eth, github issues, r/ethdev, chainlink discord), use markdown to format your question.

### Installation and Setup

#### Software

Install the following software:

- [Visual Studio Code](https://code.visualstudio.com/)
  - Extension:
    - Solidity + hardhat
    - Prettier - code formatter
- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Hardhat - built on ethers.js
- ethers.js -
- WSL for windows
  - `wsl --install`
  - Install `remote development` extension for vscode (remote wsl)
- nvm
- Install yarn by running `corepack enable` or `npm i -g yarn`
- prettier and prettier-plugin-solidity: `yarn add prettier prettier-plugin-solidity`
- (optional) To install ethers `yarn add ethers`
- (optional) [solc-js](https://github.com/ethereum/solc-js)
  - `yarn add solc` or to install a specific version `yarn add solc@0.8.7-fixed` or `yarn global add solc` to install it globally
    `yarn soljs --version`

#### Visual Studio hotkeys

- Ctrl-` - to toggle terminal
- Ctrl-k - clear terminal window
- Ctrl-Shift-p - command pallet
- Ctrl-/ - to comment the highlighted code
- Ctrl-Shift-v - markdown preview

#### Visual Studio Autoformatter

- Solidity/javascript: view command pallet → settings → preferences: Open settings (JSON)

```json
"[solidity]": {
        "editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
},


"[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"editor.formatOnSave": true
"editor.defaultFormatter": "esbenp.prettier-vscode",
```

### Synchronous vs Asynchronous

- Synchronous - Do one at a time

  1. Put popcorn in microwave
  2. Wait for popcorn to finish
  3. Pour drinks for everyone

- Asynchronous - Don't have to wait for any step to finish

  1. Put popcorn in microwave
  2. Wait for popcorn to finish
  3. Pour drinks for everyone

- Function with waiting period return a promise.
- Functions can be Async functions. You can use await. Wait till promise is fulfilled or rejected.
- async function use promises, you can wait till the promise is fulfilled.
- A promise can be
  - Pending
  - Fulfilled
  - Rejected
- Code for returning error code in main:

  ```javascript
  async function main() {}
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  ```

### solcjs

- To compile: `yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol`

### Test Network

- Hardhat fake network
- [ganache](https://trufflesuite.com/ganache/)
- Networks in metamask

### Javascript

- Ethers.js and web3.js are libraries that allow you to interact with a local or remote eth ndoe using HTTP, RPC, or websocket.
- nonce for an account is the transaction count.
- To import ethers and fs:

  ```javascript
  const ethers = require("ethers"); //consts makes it so ethers can't be change
  const fs = require("fs-extra"); //to read abi and bin complied file
  require("dotenv").config();
  ```

- BigNumber - is a big number, add `.toString()` to printout the number.
- String interpolation - eg: `Updated Favorite Number: ${updatedFavoriteNumber.toString()}`

#### Deploying a contract with ethers.js

```javascript
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//wallet = await wallet.connect(provider)

const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

//contractFactory is used to deploy contract
const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

console.log("Deploying, please wait...");
const contract = await contractFactory.deploy(); //STOP and wait for contract to deploy.
const transactionReceipt = await contract.deployTransaction.wait(1); //wait 1 block confirmation to confirm the deployment

console.log(`Contract Address: ${contract.address}`);
```

- Transaction receipt vs deployment transaction

  - Transaction receipt is only available if you wait a block confirmation after deployment.
  - Deployment transaction is the transaction response after you deploy your transaction. Transaction response is what you initially get.

  ```javascript
  console.log("Here is the deployment transaction (transaction response):");
  console.log(contract.deployTransaction);

  console.log("Here is the transaction receipt: ");
  console.log(transactionReceipt);
  ```

### Deploying with transaction data and SendTransaction

- You can deploy the contract with a transaction with ethers.js

```javascript
console.log("Let's deploy with only transaction data!");

//get nonce
const nonce = await wallet.getTransactionCount();

//transaction details
const tx = {
  nonce: nonce,
  gasPrice: 20000000000,
  gasLimit: 1000000,
  to: null,
  value: 0,
  data: "", //.bin file
  chainId: 1337,
};

//sign transaction, not necessary as .sendTransaction signs+sens
//const signedTxResponse = await wallet.signTransaction(tx);
//console.log(signedTxResponse);

//sign + send transaction
const sentTxResponse = await wallet.sendTransaction(tx);

//wait for response
await sentTxResponse.wait(1);
console.log(sentTxResponse);
```

### Interacting with contracts

- Best practice is to pass numbers as strings for calling functions

```javascript
const currentFavoriteNumber = await contract.retrieve();
console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);

//best practice is to pass numbers as strings
const transactionResponse = await contract.store("7");
const transactionReceipt2 = await transactionResponse.wait(1);

const updatedFavoriteNumber = await contract.retrieve();
console.log(`Updated Favorite Number: ${updatedFavoriteNumber.toString()}`);
```

### Secret/key management

- Start your command with a space and it won't be included in history

  - This requires the env var `$HISTCONTROL` to be set `ignorespace` or `ignoreboth`. Run `echo $HISTCONTROL` to see.
  - Update `%HOME/.bashrc` to set variable
    - `export HISTCONTROL=ignorespace`
    - `source %HOME/.bashrc`
  - Now commands shouldn't be written to $HISTFILE.

- You can run this from console with a space in beginning ` PRIVATE_KEY_PASSWORD=password node deploy.js`

- Encrypting the keys on disk

  - use this code to encrypt the key with a password and write to `.encrypted.json`
  - Delete the private key and private key password from .env file

  ```javascript
  const ethers = require("ethers");
  const fs = require("fs-extra");
  require("dotenv").config();

  async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(
      process.env.PRIVATE_KEY_PASSWORD,
      process.env.PRIVATE_KEY
    );
    console.log(encryptedJsonKey);
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  ```

- In your script:

  ```javascript
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
  ```

- After ensuring `$HISTCONTROL` is set correctly, you can run this from console with a space in beginning `<space>PRIVATE_KEY_PASSWORD=password node deploy.js`
- Run `history` to confirm or `history -c`

### prettier config

- You can save this file in the root of your project to set your formating

```json
{
  "tabWidth": 4,
  "semi": false,
  "singleQuote": false
}
```

### Verifying contract

- You can verify on `etherscan.io`
