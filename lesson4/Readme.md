# Lesson 4: Remix Fund Me

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-4-remix-fund-me)

### Useful Links

- eth-converter.com - converts between Wei, Gwei, Ether
- faucets.chain.link
- https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html - units and global variables
- solidity-by-example.org

## My Notes

- How do we send ETH to contract?
  - you use the value parameter
  - ex. `require (msg.value > 1e18, "Didn't send enough"); //1e18 = 1 * 10^18 = 1 ETH`
- Every Transactions you send will have the following fields:
  - Nonce: tx count for the account
  - Gas Price: price per unit of gas (in wei)
  - Gas Limit: max gas that this tx can use
  - To: address that the tx is sent to
  - Value: amount of wei to send
  - Data: what to send to the To address
  - v, r, s: components of tx signature
- Oracles provide data from multiple datasources that are not on the blockchain (we don't want to get the data from centralized sources)
- Chainlink data links provide prices from multiple data sources (decentralized)
- Chainlink data feeds - network of nodes, get data from different exchanges and aggregate them.
- Chainlink VRF - verifiable random function (random number)
- Chainlink keepers - event driven functions
- Chainlink any apis (end-to-end reliability)- create custom data sources to provide data to your contract. Make API calls
- Chainlink libraries:
  - npm package @chainlink
  - @chainlink/contracts is directly created from github
  - solidity import `import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";`
  - A complied interface will give you the ABI of a contract

### Libraries

- Libraries are similar to contracts, but you **can’t declare any state variable** and **you can’t send ether**.
- A library is embedded into the contract if all library functions are **internal**. Otherwise the library must be deployed and then linked before the contract is deployed.
- Libraries **Adds functionality to different values.**, eg. you can extend functionalities of uint256. ex. `using PriceConverter for uint256;`
- The first object that gets passed to the function is the first object that it gets called on.Ex. b.functiona() ⇒ functiona(b)

### Order of operations

- Always multiple, add, subtract before you divide.

### SafeMath

In older versions of solidity there was a potential for over and underflow. SafeMath was a library that provided against over and underflows. `unchecked{}` allows you to remove protection in SafeMath in newer versions of solidity.

### Increment/decrement

- funderIndex++ or funderIndex--
- funderIndex += 1 or funderIndex -= 1
- funderIndex = funderIndex + 1 or funderIndex = funderIndex - 1

### Resetting an Array

- `funders = new address[](0);` set the array to an empty array with 0 elements
- `delete funders;` delete all the its elements

### Sending eth to a contract

- 3 ways to send eth

```solidity
// transfer - simplest way to send,
// (2300 gas, throws errors (reverts))
payable(msg.sender).transfer(address(this).balance);

// send
// (2300 gas, retuns a boolean (won't reverts if send fails))
bool sendSuccess = payable(msg.sender).send(address(this).balance);
require (sendSuccess, "Send failed");

// call (recommended way to send/receive)
// lower level command, can call any function
// forward all gas or set gas, returns bool
(bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
require (callSuccess, "Call failed");
```

### Immutable & Constant

- Constant variables can't be changed, and it's assigned at compile time. Naming convention is to be ALLCAPS, with \_ between words.
- Immutable variables is set at deployment time and can only be set once. Naming convention lowercase add `i_`, eg. i_owner.

### Custom Errors

- Declare at top `error Unauthorized();`
- In the code add if statement ` if (true) { revert Unauthorized()}`

### Receive & Fallback Functions

- What happens if someone sends this contract ETH without calling the fund function.
- Receive and fallback are special functions, without the function keyword. eg. `receive() external payable {}`
- If no data is associated with the transaction and value > 0, then receive is called.
- If there is data and value > 0, then fallback() is called. eg. `fallback() external [payable]{}`
