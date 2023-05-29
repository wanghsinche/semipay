import { Inter } from 'next/font/google'
import { Demo } from "./demo";
import { Intro } from "./intro";
import { Foot } from "./foot";
import Head from 'next/head';

export default function SemiPay() {
  return <main className="">
    <Head>
      <title>SEMIPAY</title>
    </Head>
    <Intro />
    <Demo />
    <Foot />
  </main>
}