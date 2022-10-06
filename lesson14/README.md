# Lesson 14: Hardhat NFTs

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-14-hardhat-nfts-everything-you-need-to-know-about-nfts)

### Useful Links

- Solidity cheatsheet - https://docs.soliditylang.org/en/latest/cheatsheet.html
- evm.codes

## My Notes

- NFTs
  - Tokens aren't interchangeable with other NFTs
  - Digital Pieces of art
- Dollar is fungible, NFTs(none fungible token) are not interchangeable.
- ERC721 vs ERC20

  - ERC20s have a mapping between addresses and how much that address owns
  - ERC721 have unique token IDs (and URI)
    - Each token is unique
  - Define how the items look like, metadata and token URI
    - URI can be stored on IPFS

- You can use `import "@openzeppelin/contracts/token/ERC721/ERC721.sol";` to create a basic nft
- You will need to initialize the constructor:

```
  constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

```

- Create a token counter, and pass it to safe_mint
- TokenURI - the function that will tell us what the token looks like
- Setup the tokenURI function to return the token URI. It can be set to a constant URI

```
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }
```

### Javascript

- `let tokenURIMetadata = {...metadataTemplate}`
- `...` means unpack in JS
- For string replace use `.replace`

### Solidity Packing

#### encode

- encodes something down to the binary version

#### encodePacked

- Types shorter than 32 bytes are concatenated directly, without padding or sign extension
- Dynamic types are encoded in place without the length
- Array elements are padded, but still encoded in-place
- Similar to encode, but with compression
- `abi.encodePacked` returns bytes, it concatenate strings
- In solidity 0.8.12 + string.concat(stringA, stringB)

```js
    function combineStrings() public pure returns (string memory){
        //abi.encodePacked returns bytes object, we're casting it to string
        return string(abi.encodePacked("Hi Mom! ", "Miss you!")
    }
```

- When you compile the code, you get abi and bin
- When deploying contracts, the data will contain the contract init code & contract bytecode
- Bytecode represents low level op codes
- abi is application binary interface

#### decodeString

- abi.decode(bytes memory encodedData,(...))
- eg. `abi.decode(encodeString(),(string))`
- You can multiencode, and multidecode

#### Calling contracts

- You always need ABI and contract address
- staticcall used for pure and view methods
- contract.call{value:, gas:}(data);

#### Function Selector vs Function Signature

- Example of a function selector `0xa9059cbb`
- Example of function signature: `transfer(address,uint256)`
- Function example to convert signature to selector:

```solidity
 function getSelectorOne() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
    }
```

- if you want to encode the parameter with function selector

```solidity

    function getDataToCallTransfer(address someAddress, uint256 amount)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount);
    }
```

- You can do `contract.call(abi.encodeWithSelector(getSelectorOne(), someAddress, amount))` to call the function
- Or you can do this instead ` contract.call(abi.encodeWithSignature("transfer(address,uint256)", someAddress, amount) );`
  - encodeWithSignature encodes the first parameter to selector automatically.
-
