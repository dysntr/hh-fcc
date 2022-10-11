# Lesson 16: Hardhat Upgrades

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-16-hardhat-upgrades)

- Code https://github.com/PatrickAlphaC/hardhat-upgrades-fcc

### Useful Links

## My Notes

Three ways to upgrade contracts:

- Parameters
  - Can't upgrade logic, you can update the parameters
  - Pros: Simple to implement
  - Contract registry
- Social Migrate (the eat method)
  - Social YEET / Migrations
  - Lots of work to convince users to move
  - Different addresses
- Proxies
  - Update state
  - Allow upgrade of logic
  - Delegatecall to the logic contract
  - Implementation contract
    - contains all the logic
  - Proxy Contract
    - points to the implementation contract
  - The User
    - they make calls to the proxy
  - The Admin
    - they get to decide when to upgrade the contract
  - Storage is stored in the proxy contract
- Biggest Gotchas
  - Storage clashes
    - You can only append storage variables
  - Function selector clashes
    - Possible the function selector shares the same name as the admin contract
- Transparent Proxy Pattern
  - Admins can't call implementation contract functions
  - Users are powerless on admin functions
  - Admin contracts are located in the proxy contract
  - Admin functions are functions that govern the upgrades
- Universal Upgradeable Proxies
  - AdminOnly upgrade functions are in the implementation contracts instead of the proxy
- Diamond Pattern
  - Allows for multiple implementation contracts
  - Allows for granular upgrades (EIP 2535)
- Delegatecall
  - is a low level function similar to call
  - The storage of the main contract is used for the call
  - Storage layout between the two contracts have to be the same
  - Delegatecall takes the function from a different contract and runs it with in the current context.

### Minimal Proxy Example

- \_delegate()
  - does a delegatecall to a implementation contract
- setImplementation()
  - sets the implementation address
- Proxies you want nothing in storage
- EIP-1967 - specified storage slot used for implementation slot

### Different ways to implement proxies

- Deploy a proxy manually
- hardhat-deploy's builtin proxies
- Openzeppelin upgrades plugin

Example of hardhat-deploy

```js
const box = await deploy("Box", {
  from: deployer,
  args: [],
  log: true,
  waitConfirmations: waitBlockConfirmations,
  proxy: {
    proxyContract: "OpenZeppelinTransparentProxy",
    viaAdminContract: {
      name: "BoxProxyAdmin",
      artifact: "BoxProxyAdmin",
    },
  },
});
```
