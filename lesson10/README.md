# Lesson 10: NextJS Smart Contract Lottery (Full Stack / Front End)

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-10-nextjs-smart-contract-lottery-full-stack--front-end)

### Useful Links

- [6 Ways to connect your dapp to a wallet](https://www.youtube.com/watch?v=pdsYCkUWrgQ)
- [NextJS Crash Course](https://www.youtube.com/watch?v=mTz0GXj8NN0)
- github.com/MoralisWeb3/react-moralis#useweb3contract
- tailwindcss.com/docs/guides/nextjs

## My Notes

- NextJS is a react framework
- React is a JS framework for building frontend application

### NextJs

- Install `yarn create next-app .`
- To run the app `yarn run dev`
- `index.js` is the default page
  - inside the files in pages, it will include react/jsx syntax
- Pages are combination of JS and html
- React/NextJs allow us to do combo of JS and html
- imports work on the front ends, requires does not, nodes != ecmasript/javascript. BackendJS is different from front end JS
- `_app.js` is the entry point for everything. All pages get wrapped in `_app.js` page.
- React/NextJs are component based
- A component is a `.js` page that exports the page and returns some html+js.
- api folder -- when we want to do http host requests
- public folder - images/favicon
- styles folder - is going to be the css

#### Header

- js and jsx mean the same thing, jsx visually shows it's a react component
- components are independent and reusable bits of code. They serve the same purpose as JS functions, but work in isolation and return HTML.
- create `./component/Header.jsx`
- An example of `Header.jsx` component:
  ```js
  export default function Header() {
    return <div>Hi from Header!</div>;
  }
  ```
- You have to import your header in index.html and add it to return, eg. of return `<Header></Header>`, eg. of import `import Header from "../components/Header"`

- Hooks let you "hook into" react state and lifecycle features

#### Moralis

- Wrap your app.js return with `<MoralisProvider>`, eg.

```js
import { MoralisProvider } from "react-moralis";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initalizeOnMount={false}>
      (<Component {...pageProps} />)
    </MoralisProvider>
  );
}
```

- In your component that you want to use moralis, import moralis and enable web3.

```js
import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const { enableWeb3 } = useMoralis();
  return <div>Hi from Header!</div>;
}
```

- Disables hooking into a server to add more functionality `<MoralisProvider initalizeOnMount={false}>`

#### Hooks

- Hooks allow function components to have access to state and other React features. Because of this, class components are generally no longer needed.
- Allows components to automatically re-render when something changes (eg. wallet changes)
- If you want to return javascript in the return statement, use `{}`
- Example of using hooks, enableWeb3 is a hook that allows the content to re-render when the user changes their wallet:

```js
export default function ManualHeader() {
  const { enableWeb3, account } = useMoralis();
  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}!
        </div>
      ) : (
        <button
          onClick={async () => {
            console.log("pressed.");
            await enableWeb3();
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
```

#### useEffect()

- Takes a function as first parameter, and dependency array as second optional parameter. (`UseEffect(()={},[])`)
- It will keep checking the values in dependency array, and if anything changes it will call the functions in first parameter and re-render the app.

```js
useEffect(() => {
  import { useEffect } from "react";
  console.log("HI");
  console.log(isWeb3Enabled);
}, [isWeb3Enabled]);
```

- useEffect will automatically run on load
- useEffect runs twice cause of strict mode
- What happens when you give it no dependency array, is that it will run anytime something re-renders. Got to be careful as you may get circular renders.
- If you give it a black dependency array, it will run once on load.

#### LocalStorage

- You want to check to see if you have access to window object first `if (typeof window !== "undefined") `
- To store an item in localStorage (key,value) use `window.localStorage.setItem("connected", "injected") `
- To remove an item `window.localStorage.removeItem("connected")`
- To get an item `window.localStorage.getItem("connected")`

#### useMoralis

- `const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()`
- isWeb3EnableLoading - checks to see if metamask is popedup
- deactivateWeb3 - terminates web3 after logout
- chainId - returns the current chain id (hex)
- Do something on account changes

```js
 useEffect(() => {
        Moralis.onAccountChanged((account) => {})
```

-enableWeb3 - metamask popup to connect account
-account - current logged in account
-isWeb3Enabled - is a web3 account connected to the app

#### web3uikit

- To install run `yarn add web3uikit`
- To get your connect button use

```js
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
```

#### Moralis's useWeb3Contract

- use it to call a contract function

```js
import { useWeb3Contract } from "react-moralis";

const {
  runContractFunction: enterRaffle,
  data: enterTxResponse,
  isLoading,
  isFetching,
} = useWeb3Contract({
  abi: abi,
  contractAddress: raffleAddress,
  functionName: "enterRaffle",
  msgValue: entranceFee,
  params: {},
});

useEffect(() => {
  if (web3enabled) {
    async function UpdateUI() {
      const something = enterRaffle();
      console.log(something);
    }
    updateUI();
  }
}, [web3enabled]);
```

-- code to call the function

```js
<button
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
  onClick={async () =>
    await enterRaffle({
      // onComplete:
      // onError:
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    })
  }
  disabled={isLoading || isFetching}
>
  {isLoading || isFetching ? (
    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
  ) : (
    "Enter Raffle"
  )}
</button>
```

- use `./constants` folder in your project to store abi and contract addresses,(eg. `abi.json` and `contractAddresses.json`)

- notifications from web3uikit example:

```js
const handleNewNotification = () => {
  dispatch({
    type: "info",
    message: "Transaction Complete!",
    title: "Transaction Notification",
    position: "topR",
    icon: "bell",
  });
};
```

### Tailwind and Styling

- Install by `yarn add tailwindcss process autoprefixer`
- `yarn tailwindcss init -p`
- add following to tailwind.config.js
  ```js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```
-
- Update `globals.css` with following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Install `PostCSS language support` vscode extension
- Install `Tailwind CSS IntelliSense` vscode extension

### IPFS

- Decentralized file structure
- Deploy your website to IPFS
  - Build a static website - `yarn build`
  - Upload static website to ipfs or use fleak to deploy it automatically
  - Fleak build command `yarn && yarn run build && yarn next export`

### Filecoin

- IPFS offers fast, flexible retrieval
- Filecoin offers persistance and verifications
- Filecoin is a blockchain and compliments IPFS
- libp2p is a home of the OSS project that makes up the networking layer used by PL.
- NFT Storage
- Web3.Storage
  - General Filecoin & IPFS Storage
  - Familiar and simple interface
  - Production-level storage adn retrieval and reliability + performance
- Textile
  - Developers who want powerful ways to connect and extend libp2p, ipfs, filecoin
- Estuary.tech
  - People with large datasets or storing meaningful public data
- OrbitDB
  - P2P distributed database
