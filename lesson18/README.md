# Lesson 18: Security & Auditing

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-18-security--auditing)

- Code https://github.com/PatrickAlphaC/hardhat-security-fcc

### Useful Links

- consensys.github.io/smart-contract-best-practices/attacks

## My Notes

- Audit - Security code review looking for vulnerabilities
  - Process
    - Run Tests
      - coverage
    - Read specs/docs
    - Run fast tools (like slither, linters, static analysis, etc)
    - Manual Analysis
  - Two most common types of attack:
    - Reentrancy
    - Oracle Manipulation Attack
  - Min you should do
    - Run Slither
    - Look for oracle manipulation or re-entrancy
  - Mythx.io - a bot in cloud to check for automated security checks.

### Static Analysis

- Slither
  - Install python
  - Pip3
  - `pip3 install solc-select`, solc-select use 0.8.7, solc-select install 0.8.7
  - `pip3 install slither-analyzer`
  - `slither . --solc-remaps '@openzeppelin=node_modules/@openzeppelin @chainlink=node_modules/@chainlink' --exclude naming-convention,external-function,low-level-calls`
    - Red is high impact issue
    - Green are low impact

### Fuzzing

- echidna, symbolic execution
- Walking through the code

### Trail of box security toolbox

- Install docker (start service - sudo service docker start)
- Run `yarn toolbox` or `docker run -it --rm -v $PWD:/src trailofbits/eth-security-toolbox`
- `echidna-test /src/contracts/test/fuzzing/VaultFuzzTest.sol --contract VaultFuzzTest --config /src/contracts/test/fuzzing/config.yaml`
