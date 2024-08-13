import '@/styles/globals.css'
import Layout from '@/components/layout/Layout'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>Phord | Afford the Premium Real Estate</title>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}