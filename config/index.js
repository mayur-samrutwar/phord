
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, polygon, polygonMumbai, sepolia } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = '3c5877d34668c621778b071252bfc0af'

// Create a metadata object
const metadata = {
  name: 'phord',
  description: 'AppKit Example',
  url: 'http://localhost:3003', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, sepolia, polygon, polygonMumbai]
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