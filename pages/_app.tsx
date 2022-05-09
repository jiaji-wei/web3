import { providers } from 'ethers'
import { AppProps } from 'next/app'
import { Provider, chain, Connector } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const { InfuraProvider } = providers

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const CURRENT_CHAIN = chain.polygonMainnet
// Chains for connectors to support
const CHAINS = [
  // chain.mainnet,
  chain.polygonMainnet,
]

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector }
export const isChainSupported = (chainId?: number) =>
  CHAINS.some((x) => x.id === chainId)

export const provider = ({ chainId }: ProviderConfig) =>
  new InfuraProvider(
    isChainSupported(chainId) ? chainId : CURRENT_CHAIN.id,
    infuraId
  )

// Set up connectors
const connectors = () => {
  return [
    new InjectedConnector({
      chains: CHAINS,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    // new CoinbaseWalletConnector({
    //   options: {
    //     appName: 'My wagmi app',
    //     jsonRpcUrl: `${rpcUrl}/${infuraId}`,
    //   },
    // }),
  ]
}

import '../styles/global.css'

const App = ({ Component, pageProps }: AppProps) => {
  /**
   * 1. 访问他的环境
   * 2. 修改他的环境
   */

  return (
    <Provider
      autoConnect
      connectors={connectors}
      provider={provider}
      connectorStorageKey="token-set.wallet"
    >
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
