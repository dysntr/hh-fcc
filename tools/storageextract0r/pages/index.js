import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Storage from "../components/Storage"
import { useMoralis } from "react-moralis"

const supportedChains = ["31337", "5"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>Storage Extract0r</title>
                <meta name="description" content="Storage Extract0r App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Storage />
        </div>
    )
}
