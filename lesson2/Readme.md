# Lesson 2: Welcome to Remix! Simple Storage

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-2-welcome-to-remix-simple-storage)

## My Notes

### Versions

- `pragma solidity 0.8.7;` //Version should always be on top
- a version `^0.8.7` means 0.8.7 and above. You can use `>=0.8.7 <0.9.0` to say a version between those two versions.
- Always leave comments and notes in your code.

### License Identifier

- `// SPDX-License-Identifier: MIT`

### Contract Definition

- `contract SimpleStorage {}`

### Variable Types

Variables are holders for different values.

- bool - true/false, eg. `bool x = false;`
- uint - unsigned integer whole number, eg. `uint x = 123;`, uint8 to uint256. Lowest size is 8 bits (1 byte), can go up by steps of 8.
- int - positive or negative whole number, eg. `int x = -123;`.
- string - represent words (actually bytes object), eg. `string name = "John";`
- address - metamask address, eg. `address myAddress = 0x12321..2342;`
- bytes - eg. `bytes32 favBytes = "cat"`;
- struct - items get indexed in the structure
  - ` struct People { uint256 favoriteNumber; string name; }`
  - ex. `People public person = People ({favoriteNumber: 1, name:"d"});`
- array - a way to store a list of objects
  - dynamic and fixed size
  - ex. declare dynamic array `People[] public people;`
  - ex. add people to list `people.push(People(_favoriteNumber, _name));`
- Mapping - is a data structure where a key is "mapped" to a single value
  - ex. `mapping(string => uint256) public nameToFavoriteNumber;`
  - Everything is initialized to null value (0)

### Function

- `function store(uint _fav) public {fav =_fav}`

### Visibility

#### Functions

- `public` - visible externally and internally (creates a getter function for storage/state variables)
- `private` - only visible in the current contract
- `external` - only visible externally (only for functions) - i.e. can only be message-called (via this.func)
- `internal` - only visible internally. Internal functions can only be accessed from within the current contract or children contract ( contracts deriving from it). (by default variables get defined as `internal`)

### State Mutability

- `pure` disallow reading or modifying from blockchian
- `view` promise not to modify the state of th eblockchain

### Scope

- `{}` define scope for the variables

### EVM Storage overview

6 Places you can store and access data :

- calldata - can’t be modified, temporary variables.
- memory - temporary variables, can be modified.
- storage - permanent variables that can be modified.
- code
- logs
- stack

You need to specify the storage location for array, struts and mapping when passing as parameters.

### Eth Faucet

[Chain Link Faucet](https://docs.chain.link/docs/link-token-contracts/#goerli)

### Remix Shortcut

- Ctrl-S complies the code
