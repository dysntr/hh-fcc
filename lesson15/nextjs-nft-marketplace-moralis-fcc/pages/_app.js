import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { allChains, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

function MyApp({ Component, pageProps }) {
    const { chains, provider } = configureChains(allChains, [
        alchemyProvider({ apiKey: process.env.ALCHEMY_MAINNET_RPC_URL }),
        publicProvider(),
    ])

    const { connectors } = getDefaultWallets({
        appName: "My RainbowKit App",
        chains,
    })

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    })

    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider
                    chains={chains}
                    modalSize="compact"
                    showRecentTransactions={true}
                >
                    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                        {/* <NotificationProvider> */}
                        <Header />
                        <Component {...pageProps} />
                        {/* </NotificationProvider> */}
                    </MoralisProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </div>
    )
}

export default MyApp
