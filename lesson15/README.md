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

### FrontEnd

1. Home Page:
   1. Show recently listed NFTs
      1. If you own the NFT, you can update the listing
      2. If not, you can buy the listing
2. Sell Page:
   1. You can list your NFT on the marketplace

- To use rainbowkit add following code to app.js

```js
import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
function MyApp({ Component, pageProps }) {
    const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_MAINNET_RPC_URL }),
        publicProvider(),
    ]
    );

    const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
    });

    const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    });
```

- You can add a connect button by importing `import { ConnectButton } from "@rainbow-me/rainbowkit"` and add `<ConnectButton />` to header.

### Links

- To create navbar use `<nav>` tag, example of a nav bar:

```js
<nav className="p-5 border-b-2 flex flex-row justify-between items-center">
  <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
  <div className="flex flex-row items-center">
    <Link href="/">
      <a className="mr-4 p-6">Home</a>
    </Link>
    <Link href="/sell-nft">
      <a className="mr-4 p-6">Sell NFT</a>
    </Link>
    {/* <ConnectButton moralisAuth={false} /> */}
    <ConnectButton />
  </div>
</nav>
```

- To use nextjs links `import Link from "next/link"`
- Example of a header link

```js
<Link href="/">
  <a className="mr-4 p-6">Home</a>
</Link>
```

### How to get a listing of all NFTs

#### Challenges

- Create an array of listing in contract
- Get all the NFTs a user owns?
- Query some other weird data
- What if an array will be very gas expensive!!
- We don't want to change too much of our protocol for just the website.

#### Solutions

- Events
- Moralis (index the events off-chain and read from our database)
  - setup a server to listen for those events for to be fired and we will add them to a database to query
  - Moralis does this in a centralized way.
  - Moralis Identity, Real-time, SDKs, APIs
- The graph protocol does this in a decentralized way.

- How to show recently listed NFTs?

  - Setup Moralis to listen to events.
  - Create a dapp server, connect it to our blockchain
  - Which contract, which events, and what to do when it hears those events
  - Run `yarn hardhat node` to start your localnode server
  - In Moralis setup a Devchain proxy server (under network for the dapp)
    - use `frpc` to setup a reverse proxy to connect back to moralis
    - setup moralis admin cli `yarn add -g moralis-admin-cli`
    - The moralisApikey and secret key are in the cloud functions tab of the server.

- If variables in .env have NEXT*PUBLIC*, it means it can be accessed from the frontend.
- `lesson15/nextjs-nft-marketplace-moralis-fcc/addEvents.js` is an example of how you can add event listening for moralis local dev environment server. Run it by `node addEvent.js`
- Moralis only accepts the chainid for localserver to be 1337, so you may have to change that in the code.
- To test event generations, run `yarn hardhat run scripts/mint-and-list-item.js --network localhost`
