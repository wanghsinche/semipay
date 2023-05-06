import { IConfig, generateCheckout } from "@/services/id-generator";
import { callWebhook } from "@/services/webhook";
import { NextPageContext } from "next";
import React, { useEffect, useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
  },
  label: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  qrcode: {
    width: '250px',
    height: '250px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
  },
  amount: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px',
  },

};


export default function Page({ checkout, base64, user, extra, msgTemplate }: { checkout: IConfig, user: string, extra: string, base64?: string, msgTemplate?: string }) {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!checkout) {
      setTimeout(() => {
        window.location.reload()
      }, 60 * 1000);
      return;
    }
    const expiry = Date.now() + 120 * 60 * 1000;
    callWebhook(msgTemplate ? msgTemplate.replaceAll('{{user}}', user)
      .replaceAll('{{remark}}', checkout.remark)
      .replaceAll('{{price}}', String(checkout.price)) : {
      user, remark: checkout.remark, extra
    })
    function checking() {
      if (Date.now() > expiry) {
        setExpired(true);
        return;
      }
      setTimeout(() => {
        checking();
      }, 30000);
    }
    checking();
  }, [checkout])
  if (expired) {
    return <div>
      页面已经过期, 请关闭
    </div>
  }
  // Render data...
  if (!checkout) {
    return <div style={styles.container}>
      <p style={styles.label}>排队中, 请等待...</p>
      <div style={styles.qrcode}>
        ...
      </div>
    </div>
  }
  return <div style={styles.container}>
    <p style={styles.label}>请使用微信扫码支付</p>
    <p style={styles.label}>{user}的流量会在支付成功后0.5个工作日内更新:</p>
    <img src={base64} style={styles.qrcode} alt="qrcode" width={100} />
    <p style={styles.amount}>¥{checkout.price.toFixed(2)}</p>
  </div>

}

// This gets called on every request
export async function getServerSideProps(ctx: NextPageContext) {
  console.log('vtx', ctx.req?.url)
  const url = new URL(ctx.req?.url || '', 'https://base.com');
  const user = url.searchParams.get('user');
  const price = url.searchParams.get('price') || void 0;
  const extra = url.searchParams.get('extra');
  const msgTemplate = url.searchParams.get('msgTemplate');
  // Fetch data from external API
  const checkout = await generateCheckout(Number(price));
  if (!checkout) return { props: { checkout, user, price, extra } };

  const buff = await fetch(checkout.url).then((response) => response.arrayBuffer()); // Get the image as a Blob

  const base64 = `data:image/jpg;base64,${Buffer.from(buff).toString('base64')}`;


  // Pass data to the page via props
  return { props: { checkout, user, extra, base64, msgTemplate } };
}
