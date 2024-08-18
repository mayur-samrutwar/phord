
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Create a metadata object
const metadata = {
  name: 'phord',
  description: 'AppKit Example',
  url: 'https://www.phord.online',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

// Create wagmiConfig
const chains = [polygonAmoy, mainnet, sepolia, polygon ]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  auth: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'facebook'],
    showWallets: false, 
    walletFeatures: false
  }
})