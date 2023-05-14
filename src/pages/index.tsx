import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import {SemiPay} from './legacy'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
return <SemiPay />
}
