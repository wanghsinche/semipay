import { Inter } from 'next/font/google'
import Demo from "../main/demo";
import { Intro } from "../main/intro";
import { Foot } from "../main/foot";
const inter = Inter({ subsets: ['latin'] })

export default function SemiPay() {
  return <main className="">
    <Intro />
    <Demo />
    <Foot />
  </main>
}