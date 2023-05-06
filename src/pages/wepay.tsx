import { IConfig, generateCheckout } from "@/services/id-generator";
import { callWebhook } from "@/services/webhook";
import { NextPageContext } from "next";
import React, { useEffect, useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: '-100%',
    left: '-100%',
    width: '300%',
    height: '300%',
    backgroundImage: 'linear-gradient(135deg, #07c160 0%, #09a550 100%)',
    transform: 'rotate(-45deg)',
    zIndex: '-1',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    position: 'relative',
    zIndex: '1',
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
  description: {
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '5px',
    color: '#888',
  },
  username: {
    wordBreak: 'break-word',
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '5px',
    marginBottom: '10px',
    color: '#888',
  },
};


export default function Page({ checkout, base64, user, extra, msgTemplate }: { checkout: IConfig, user: string, extra: string, base64?: string, msgTemplate?: string }) {
  const [expired, setExpired] = useState(false);
  const defaultExpiry = new URLSearchParams(location.search).get('expiry');
  const [expiry] = useState(Number(defaultExpiry) || (Date.now() + 2 * 60 * 1000))
  useEffect(() => {
    if (!checkout) {
      setTimeout(() => {
        window.location.reload()
      }, 60 * 1000);
      return;
    }
    function checking() {
      console.log('checking', Date.now(), expiry)
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
      <div style={styles.background} />
      <div style={styles.content}>
        <p style={styles.label}>排队中, 请等待...</p>
        <div style={styles.qrcode}>
          ...
        </div>
      </div>
    </div>
  }
  return <div style={styles.container}>
    <div style={styles.background} />
    <div style={styles.content}>
      <p style={styles.label}>请使用微信扫码支付</p>
      <p style={styles.username}>务必在备注写上你的用户名：{user}</p>
      <img src={base64} style={styles.qrcode} alt="qrcode" width={100} />
      <p style={styles.amount}>¥{checkout.price.toFixed(2)}</p>
      <p style={styles.description}>流量会在支付成功后0.5个工作日内更新</p>
    </div>
  </div>

}

// This gets called on every request
export async function getServerSideProps(ctx: NextPageContext) {
  console.log('vtx', ctx.req?.url)
  const url = new URL(ctx.req?.url || '', 'https://base.com');
  const user = url.searchParams.get('user') || '';
  const price = url.searchParams.get('price') || void 0;
  const extra = url.searchParams.get('extra') || '';
  const msgTemplate = url.searchParams.get('msgTemplate');
  // Fetch data from external API
  const checkout = await generateCheckout(Number(price));
  if (!checkout) return { props: { checkout } };

  const buff = await fetch(checkout.url).then((response) => response.arrayBuffer()); // Get the image as a Blob

  const base64 = `data:image/jpg;base64,${Buffer.from(buff).toString('base64')}`;

  await callWebhook(msgTemplate ? msgTemplate.replaceAll('{{user}}', user)
    .replaceAll('{{remark}}', checkout.remark)
    .replaceAll('{{price}}', String(checkout.price)) : {
    user, remark: checkout.remark, extra
  }).catch(err => {
    console.log(err);
  })

  // Pass data to the page via props
  return { props: { checkout, user, extra, base64, msgTemplate } };
}
