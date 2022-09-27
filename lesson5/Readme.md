# Lesson 5: Ethers.js Simple Storage

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-5-ethersjs-simple-storage)

### Useful Links

- eth-converter.com - converts between Wei, Gwei, Ether
- faucets.chain.link
- https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html - units and global variables
- solidity-by-example.org

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
    - Prettier -code
- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Hardhat - built on ethers.js
- ethers.js -
- WSL for windows
  - `wsl --install`
  - Install `remote development` extension for vscode (remote wsl)
- nvm
- yarn by running `corepack enable`

#### Visual Studio hotkeys

- Ctrl-` - to toggle terminal
- Ctrl-k - clear terminal window

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
