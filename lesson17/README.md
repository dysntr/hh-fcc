# Lesson 17: Hardhat DAOs

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-17-hardhat-daos)

- Code - https://github.com/PatrickAlphaC/hardhat-dao-fcc

### Useful Links

## My Notes

- DAO - Decentralized Autonomous Organizations
  - Any group that is governed by a transparent set of rules found on a blockchain or smart contract
  - Immutable, transparent and decentralized
  - Voting Mechanism
    - Use Tokens
      - Not very fair as voting is correspondence to the rich
    - Skin in the game
      - If you get bad decisions you will get punished for
    - Proof of Personhood or participation
      - Sybil resistance (how do make sure 100 participants is not 1 person)
    - Governer C
      - quadratic voting
  - On chain voting
  - Off chain voting
    - snapshot
  - `ERC20Votes` contract takes a snapshot to prevent pump and dump for votes
    - `import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";`
    - ` constructor() ERC20("GovernanceToken", "GT") ERC20Permit("GovernanceToken") {`
    - need to override ` function _afterTokenTransfer` to make sure snapshots are updated
  - Governance contract will need consist of govenorcontract and timelock
    - Timelock - We want to wait for a new vote to be "executed". Give time to users to "get out" if they don't like a governance update. Once a proposal passes, it needs to wait for some time before going into effect.
    - You can use openzepplin contract wizard to create the governor
    - Whenever checkpoint is updated, the number of token holders is recorded.
  - MIN_DELAY for time lock - `3600 // 1 hour - after a vote passes, you have 1 hour before you can enact`
  - The governor contract should be the only one that proposes. Governor contract can only be the one that proposes something to the time lock. Anyone can executed it.
  - Give the executor role to address zero, which means anyone can execute it
  - Process to go through governance:
    - Propose
    - Vote
    - Queue and Execute
  - Castvote by signature, allows voting by signature
