import { useState, useEffect } from "react";
import { Inter } from 'next/font/google'
import Demo from "../main/demo";
const inter = Inter({ subsets: ['latin'] })

export default function SemiPay (){
  
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
  
          <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-4">SEMIPAY - An Open Source Wechat Payment Solution</h1>
            <p className="mb-8">
              <a className="mb-8" href="https://github.com/wanghsinche/semipay" data-size="large" data-show-count="true" aria-label="Star wanghsinche/semipay on GitHub"><i className="ri-github-line"></i>Star</a>
            </p>
            <p className="mb-8">
              Welcome to SEMIPAY, a semi-automatic WeChat payment solution that can be easily deployed privately with a single click on Vercel.
            </p>
            <p className="mb-8">
              It helps create a personal semi-automatic payment collection system and eliminates the need for record filing and transaction fees associated with online payments
            </p>
            <p className="mb-8"><i className="ri-github-line"></i> github fork
                <a className="mx-8 text-red-800" href="https://github.com/wanghsinche/semipay" data-size="large" data-show-count="true" aria-label="Star wanghsinche/semipay on GitHub">https://github.com/wanghsinche/semipay</a>
            </p>
            <Demo />
  
            <h2 className="text-2xl font-bold my-4">Usage</h2>
  
            <h3 className="text-xl font-bold my-4">Set up the config</h3>
            <p className="mb-8 bg-gray-200">
              use the following JSON to set up your vercel edge-config  https://vercel.com/dashboard/stores/edge-config
            </p>
  
            <pre className="bg-gray-200 p-4 rounded ">
              <code className='break-all'>
                {`
  {
    "qrcode": [
      {
        "url": "https://..co/storage/v1/object/public/static/five1.jpg",
        "remark": "five1",
        "price": 5
      },
      {
        "url": "https://..co/storage/v1/object/public/static/five2.jpg",
        "remark": "five2",
        "price": 5
      },
      {
        "url": "https://..co/storage/v1/object/public/static/five3.jpg",
        "remark": "five3",
        "price": 5
      }
    ],
    "webhook": "https://ok/api/wepaynotify?",
    "telegram": "https://api.telegram.org/botxxxx:xxxx/sendMessage?chat_id=xxx&",
    "email": "",
    "notifier": "",
    "hostname": "https://pay",
    "confirmWebhook": "https://ok/api/wepaynotify?",
    "secret": "123"
  }
                `}
              </code>
            </pre>
            <h3 className="text-xl font-bold my-4">To get a checkout link from your business server</h3>
            <pre className="bg-gray-200 p-4 rounded ">
              <code className='break-all'>
                {`
  const hostname = 'https://your.pay.domain';
  // prepare your info
  const info = {
      price: 0,
      user: 'donate@user.com',
      extra: 'donate',
      timestamp: Date.now()
  };
  // get the secret
  const secret = process.env.SECRET;
  // in alphabet order
  const text = Object.keys(info).sort().map(k=> info[k]).join(','); 
  // use sha256 to encrypt your info
  const token = createHmac('sha256', secret).update(text).digest('base64');
  const checkout = await fetch(\`\${hostname}/api/checkout\`, {
      method: 'post',
      body: JSON.stringify({...info, token})
  }).then(res=>{
      if(res.status !== 200) throw new Error(res.status);
      return res;
  }).then(res=>res.json());
  // get the checkout url
  console.log(checkout);
  `}
              </code>
            </pre>
          </div>
        </div>
      </main>
    )
}