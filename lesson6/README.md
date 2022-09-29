# Lesson 6: Hardhat Simple Storage

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-6-hardhat-simple-storage)

### Useful Links

- chainlist.org

## My Notes

- Hardhat JS development environment

### Creating a new Hardhat project

To create a new hardhat project run the following command:

- `yarn init`
- `yarn add --dev hardhat`
- `yarn --dev` (dependencies are required to run your project, --dev are only required for development)
- You can run `yarn hardhat` or `npx hardhat`.
- To download the libraries of another project run `npm install` or `yarn`
- Contracts are stored in ./contract folder
- Tests are stored in ./test folder
- Scripts are stored in ./scripts
- Tasks are commands we can use with hardhat.
- `yarn hardhat console` - run into the hardhat shell, you can run commands it. `yarn hardhat console --network hardhat` to connect to a different network.

### Hardhat compilation and deployment

- To compile run `yarn hardhat compile`
- To change your compiler version change `module.exports ={solidity:"0.8.0",}` in `hardhat.config.js`
- `artifacts` folder contains information about the compile code.
- To deploy run command `yarn hardhat run scripts/deploy.js`
- To deploy to a specific network run command `yarn hardhat run scripts/deploy.js --network hardhat`

Code to deploy and verify with hardhat and ethers hardhat:

```js
// yarn hardhat run scripts/deploy.js
// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
	const SimpleStorageFactory = await ethers.getContractFactory(
		"SimpleStorage"
	);

	console.log("Deploying contract...");
	const simpleStorage = await SimpleStorageFactory.deploy();

	//wait till it's deployed
	await simpleStorage.deployed();

	console.log(`Deployed contract to: ${simpleStorage.address}`);
	// what happens when we deploy to our hardhat network?
	if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
		console.log("Waiting for block confirmations...");
		await simpleStorage.deployTransaction.wait(6);
		await verify(simpleStorage.address, []);
	}

// Code to verify code.
// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
	console.log("Verifying contract...");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (e) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("Already Verified!");
		} else {
			console.log(e);
		}
	}
};

// main
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
```

### hardhat.config.js

- Other networks can be added in hardhat.config.js
- Here is an example of hardhat.config.js

```js
require("@nomicfoundation/hardhat-toolbox"); //required for actions
require("@nomiclabs/hardhat-etherscan"); //required for verification
require("dotenv").config(); //required for environment variables
require("hardhat-gas-reporter"); // required for gas reporting
require("solidity-coverage"); // required for solidity coverage

/** @type import('hardhat/config').HardhatUserConfig */
const RINKEBY_RPC_URL = process.env.RINKEBY_API_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: `${ETHERSCAN_API_KEY}`,
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  solidity: "0.8.8",
};
```

- `==` vs `===` in JS
  - 4 == 4 → true
  - 4 == “4” → true
  - 4 === “4” → false

### Interacting with contract in hardhat

```js
const currentValue = await simpleStorage.retrieve();
console.log(`Current Value is: ${currentValue}`);

// Update the current value
const transactionResponse = await simpleStorage.store(7);
await transactionResponse.wait(1);
const updatedValue = await simpleStorage.retrieve();
console.log(`Updated Value is: ${updatedValue}`);
```

### Hardhat troubleshooting

- Delete /artifact folder
- Delete /cache folder
- `yarn hardhat clean` //cleans cache and artifacts automatically

### Custom hardhat tasks

- Example of js anonymous function `async() =>{}`
- [create task](https://hardhat.org/hardhat-runner/docs/advanced/create-task)
- Create the task under /tasks/ folder. eg. accounts.js
- In hardhat.config.js add `require ("./tasks/accounts")`

Example task:

```js
const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts").setAction(
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  }
);

module.exports = {};
```

### hardhat node localhost

- To start node run `yarn hardhat node`
- Add the following code to hardhat.config.js

  ```js
  localhost: {
              url: "http://127.0.0.1:8545",
              chainId: 31337,
          },
  ```

- To deploy to the localnode run `yarn hardhat run scripts/deploy.js --network localhost`

### Running Tests

- Hardhat testing works with mocha framework
- Place tests in `/test/` folder
- use `describe("SimpleStorage", function () {}` to start a test
  - you can use nested describes, and beforeEach
- Inside the function, use `beforeEach(async function () {})` to tell the complier what to run before each `it`.
- Use `it("Should start with a favorite number of 0", async function () {})` the specify the actual test cases

  ```js
  const { ethers } = require("hardhat");
  const { expect, assert } = require("chai");

  describe("SimpleStorage", function () {
  	let simpleStorageFactory, simpleStorage;
  	beforeEach(async function () {
  		simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  		simpleStorage = await simpleStorageFactory.deploy();
  	});

  	it("Should start with a favorite number of 0", async function () {
  		const currentValue = await simpleStorage.retrieve();
  		const expectedValue = "0";
  		assert.equal(currentValue.toString(), expectedValue);
  		//expect(currentvalue.toString()).to.equal(expectedValue)
  	});
  }
  ```

- you can run the rest by using grep eg. `yarn hardhat test --grep store`

#### assert vs expect

Different ways of testing the same thing:

- `assert.equal(currentValue.toString(), expectedValue);`
- `expect(currentvalue.toString()).to.equal(expectedValue)`

### Hardhat gas reporter

- It gets attached to tests and reports how much gas each function uses, run `yarn hardhat test` and the gas report will get attached to the bottom of the test.
- To install run `yarn add hardhat-gas-reporter --dev`
- Need API key from coinmarketcap
- Add following config to `hardhat.config.js`

```js
gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
```

- Add import to hardhat.config.js, `require("hardhat-gas-reporter");`

### Hardhat Solidity coverage

- Goes through all tests and sees how many lines of code is actually tested
- Add solidity coverage by installing it via `yarn add --dev solidity-coverage`
