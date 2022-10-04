# Lesson 13: Hardhat DeFi & Aave

- [Lesson Link](https://github.com/PatrickAlphaC/hardhat-defi-fcc)

### Useful Links

- defillama.com
- speedrunetherem.com

## My Notes

We want to:

1. Deposit collateral: ETH / WETH
2. Borrow another asset: DAI
3. Repay the DAI

- TO get WETH you deposit ETH and get WETH
  - WETH is ERC20 token
  - Always need abi and contract address to call the functions and account, use `ethersContractAt(abi,contract address, account)`
    - reading you don't need account (signer), writing you need a signer
- Best practice is to start interfaces with I, eg. IWeth.sol
- Example of calling a contract with abi

```js
async function getWeth() {
  const { deployer } = await getNamedAccounts();
  const iWeth = await ethers.getContractAt(
    "IWeth",
    networkConfig[network.config.chainId].wethToken,
    deployer
  );
  const txResponse = await iWeth.deposit({
    value: AMOUNT,
  });
  await txResponse.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
}
```

### Mainnet forking

- yarn hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>
- Pros: quick, easy and it will resemble what's on mainnet
- Cons: We need an API, some contracts are complex to work with
- You can add api to `hardhat.config.js`

```
  networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
```

- I had to add the following export to make the aaveborrow work, `export NODE_OPTIONS=--openssl-legacy-provider`. (Error: error:0308010C:digital envelope routines::unsupported)

### AAVE

- Has a contract, `LendingPoolAddressProvider` to tell you the address of the lending pool provider
- To add aave contracts, `yarn add --dev @aave/protocol-v2/contracts/`
- lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", will give us the Lending Pool address
- Here is the code to get the lending pool

```js
async function getLendingPool(account) {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    networkConfig[network.config.chainId].lendingPoolAddressesProvider,
    account
  );
  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
}
```

### ERC20 Approve

```JS
async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
    txResponse = await erc20Token.approve(spenderAddress, amount)
    await txResponse.wait(1)
    console.log("Approved!")
}
```

### Speed Run Ethereum

- Scalfold eth (front end react, smartconftract)
  - The frontend automatically adapts to the backend code
