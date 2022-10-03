# Lesson 12: Hardhat ERC20s

- [Lesson Link](https://github.com/PatrickAlphaC/hardhat-erc20-fcc)

### Useful Links

- https://github.com/ethereum/EIPs

## My Notes

- EIP - Ethereum Improvement Proposals
- ERC - Ethereum Request for Comments
- ERC-20 - Token Standard
  - Build a contract that follows the standards
- To install openzepplin contracts `yarn add --dev @openzeppelin/contracts`
- Creating a simple ERC20 token

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    // initial supply is 50 <- 50 WEI
    // initial supply 50 *e18 ( number of deciamls)
    // 50 * 10 ** 18
    constructor(uint256 initialSupply) ERC20("OutToken", "OT") {
        _mint(msg.sender, initialSupply);
    }
}
```
