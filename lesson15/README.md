# Lesson 15: NextJS NFT Marketplace (Full Stack / Front End)

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-15-nextjs-nft-marketplace-if-you-finish-this-lesson-you-are-a-full-stack-monster)

- Backend (Contracts): https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc
- Frontend (Moralis Indexer): https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc
  - Frontend (TheGraph Indexer): https://github.com/PatrickAlphaC/nextjs-nft-marketplace-thegraph-fcc
  - The Graph: https://github.com/PatrickAlphaC/graph-nft-marketplace-fcc

### Useful Links

- rekt.news

## My Notes

- Artion-Contracts open source completely decentralized marketplace
- Concept of pull vs push - you want to shift the risk of transferring eth to the user
  - instead of sending the money to the user, we want them to withdraw the money
- For ERC721 you want to use safeTransferFrom instead of transferFrom

### Reentrancy Attack

- Re-entering the function multiple times to drain the contract
- Change states first, then transfer the NFT
- Calling external contract should be the last step in your function
- One of the two most common attacks are
  - Reentrancy attack
  - Oracle attacks
    - Only happens when you're not using a decentralized oracle
- You can use mutex to prevent re-entrance (@openzeppelin/contracts/security/ReentrancyGaurd.sol)
