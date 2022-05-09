import Create from '@components/index/Create'
import { Navbar } from '@components/Navbar'
import Head from 'next/head'

export const Home = (): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Web3 </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Navbar />
        {/* <Example /> */}
      </header>

      <main className="">
        {/* <ERC20 /> */}
        <Create />
      </main>
    </div>
  )
}

export default Home
