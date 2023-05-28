import { Inter } from 'next/font/google'
import { Demo } from "./demo";
import { Intro } from "./intro";
import { Foot } from "./foot";

export default function SemiPay() {
  return <main className="">
    <Intro />
    <Demo />
    <Foot />
  </main>
}