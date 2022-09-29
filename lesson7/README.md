# Lesson 7: Hardhat Fund Me

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-7-hardhat-fund-me)

### Useful Links

- [Solidity styling guide](https://docs.soliditylang.org/en/v0.8.15/style-guide.html)
- https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
- github.com/crytic/evm-opcodes

## My Notes

### Linters

- Solhint is a solidity linter (install by `yarn add --dev solhint)
- Linters analyse the program code for potential errors
- ESLint is a Javascript linter
- Solhint can use `.solhint.json` config file
- Run solhint by running `yarn solhint contracts/*.sol`
- Linters are a good way to check on best practices

### Hardhat Deploy

- Keeping track of deployment gets tricky
- `yarn hardhat node` will save all our deployed contracts
- You want to install the following two packages:

  ```bash
  yarn add --dev hardhat-deploy

  #override hardhat and ethers with hardhat-deploy-ethers
  yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
  ```

- When you run yarn deploy, it deploys all the script in the `/deploy` folder.
- A good practice is to number them, so they run in the order you want them.
- This is how you want to write your deploy function:

  ```js
  //imports
  const { getNamedAccounts, deployments, network } = require("hardhat");
  const {
    networkConfig,
    developmentChains,
  } = require("../helper-hardhat-config");
  const { verify } = require("../utils/verify");

  //define anonymous function
  //pull variables out of the hre as your parameters eg. getNamedAccounts, deployments
  module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    //code goes here
  };

  //add tags for export
  module.exports.tags = ["all", "fundme"];
  ```

- `yarn hardhat deploy —tags all` or `yarn hardhat deploy --tags mocks` will only run the deploy files that export those tags.
- //getNamedAccounts will get the named accounts from hardhatconfig.js

- Example of `hardhatconfig.js`:

  ```js
      namedAccounts: {
          deployer: {
              default: 0, // here this will by default take the first account as deployer
              1: 0, // similarly on ETHmainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
              4: 1, // eg. on rinkby you can use account 4.
          },
          user:{
             default: 3
          },
      },
  ```

- Example of how you would call them in the code ` const { deployer } = await getNamedAccounts();`

- What is mocking? ([link](stackoverflow.com/questions/2665812/what-is-mocking))

  - Mocking is primarily used in unit testing. An object under test may have dependencies on other (complex) objects. An object under test may have dependencies on other (complex) objects. To isolate the behavior of the object you want to replace the other objects by mocks that simulate the behavior of the real objects. This is useful if the real objects are impractical to incorporate into the unit test.
  - TL/DR Objects that simulate the behavior of real objects

- use a helper-hardhat-config.js to specify custom config for deploying across chains, eg. priceaggreator address on different chains.

Example of using a mock from a project:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";
```

- To deploy mocks run `yarn hardhat deploy --tags mocks`

### Variable Naming

- immutable add i\_
- storage add s\_

### Javascript

- `const {x} = require("y")` is same as

  ```js
  const y = require("y");
  const x = y.x;
  ```

- x has to be exported at the bottom of `y` to be able to do `const {x} = require("y")`

- The statement `developmentChains.includes(chainId)` checks `developmentChains` for `chainId`

### Code Styling

- [Solidity styling guide](https://docs.soliditylang.org/en/v0.8.15/style-guide.html)

#### Order of Layout

- Layout contract elements in the following order:

  - Pragma statements
  - Import statements
  - Interfaces
  - Libraries
  - Error codes (eg. error NameOfContract\_\_ErrorName())
  - Contracts

- Inside each contract, library or interface, use the following order:

  - Type declarations
  - State variables
  - Events
  - Modifiers
  - Functions

#### Functions Order:

- constructor
- receive
- fallback
- external
- public
- internal
- private
- view / pure

#### NatSpec

- Uses Doxygen style comments and tags
- Example of natspec comment for contract/functions

```js
/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
```

```js
/** @notice Gets the amount that an address has funded
 *  @param fundingAddress the address of the funder
 *  @return the amount funded
 */
```

- To create docs automatically run `solc --userdoc --devdoc ex1.sol`

### Testing

- Flow of test should go like this:
  - Arrange the test
  - Act
  - Assert
- To run the tests that are located in `/test/` folder and check coverage, run `yarn hardhat test` and `yarn hardhat coverage`
- `await deployments.fixture(["all"])` runs the content of deploy folder with as many tags as you want.
- This command will get the most recently deployed: `contract fundMe = await ethers.getContract("FundMe", deployer)` , deployer will be the account connected to "FundMe".
- Waffle allows you to use `expect`
- list of matchers: https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
- set a describe for each function
- chai is being overwritten by waffle.
- `yarn add --dev ethereum-waffle` and `yarn add --dev @nomiclabs/hardhat-waffle`

```js
const { assert, expect } = require("chai");
await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
```

- You can get balance of contract/account and calculating gas :

```js
const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

// Act
const transactionResponse = await fundMe.withdraw();
const transactionReceipt = await transactionResponse.wait();
const { gasUsed, effectiveGasPrice } = transactionReceipt;
const gasCost = gasUsed.mul(effectiveGasPrice);

const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

// Assert
// Maybe clean up to understand the testing
assert.equal(endingFundMeBalance, 0);
assert.equal(
  startingFundMeBalance.add(startingDeployerBalance).toString(),
  endingDeployerBalance.add(gasCost).toString()
);
```

#### staging vs unit tests

- unit testing is in controlled environment
- staging is real like environment, assuming we're on a test net
  - yarn hardhat test --network rinkeby

### Debugging Tip

- In hardhat you can use `import "hardhat/console.sol";` to print things to the console from solidity
- Inside solidity you can do `console.log("",balances[msg.sender]);
- You can use vscode javascript debugger and debug console to view variables during run time.

### Storage

- Consists of 32 bytes storage slots
- Slot[0] to slot[i] where i is uint256
- Each state variable takes a full storage slot
- For dynamic values like mappings adn dynamic arrays, the elements are stored using a hashing function. You can see those functions in the documentations. (eg. Keccak256(slotnumber where the array length is stored))
  - For arrays, a sequential storage spot is taken up for the length of the array
  - For mappings, a sequential storage spot is taken up, but left blank
- Constant variables are complied in the contract byte code.
- use s\_ for variables that are storage
- mappings can't be in memory

### Gas Usage

- Balance op code uses 700 gas
- EXTCODESIZE - get size of an account's code - 700 gass
- EXTCODECOPY - Copy an account's code to memory - 700 gass
- SLOAD OP code - load word from storage - 800 gas used
- SSTORE - Save word to storage - 20,000\* gas used
- Log0-Log4 - between 375 to 1875 (1-4 topics)
- CREATE - 32000 gas
- private variables are cheaper

### Adding scripts to your package
