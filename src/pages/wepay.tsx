import { IConfig, generateCheckout } from "@/services/id-generator";
import Image from "next/image";

export default function Page({ checkout }:{ checkout: IConfig}) {
  // Render data...
  if (!checkout) {
    return <div>
      too busy
    </div>
  }
  return <div>
    {checkout.remark}
    <Image alt="qrcode" src={checkout.url} width={300} />
  </div>
}
 
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const checkout = await generateCheckout()
  // Pass data to the page via props
  return { props: { checkout } };
}
