import '@/styles/globals.css'
import Layout from '@/components/layout/Layout'
import Head from 'next/head'
import { cookieToInitialState } from 'wagmi';
import { config } from '../config';
import AppKitProvider from '../context';

function getInitialState() {
  // In the pages directory, we don't have direct access to headers()
  // so we'll need to use document.cookie if we're on the client side
  if (typeof window !== 'undefined') {
    return cookieToInitialState(config, document.cookie);
  }
  // For server-side rendering, we can't access cookies directly
  // You might need to pass cookies through props or use a different method
  return undefined;
}

export default function MyApp({ Component, pageProps }) {
  const initialState = getInitialState();
  return (
    <>
    <Head>
      <title>Phord | Afford the Premium Real Estate</title>
    </Head>
    <Layout>
    <AppKitProvider initialState={initialState}>
      <Component {...pageProps} />
      </AppKitProvider>
    </Layout>
    </>
  )
}