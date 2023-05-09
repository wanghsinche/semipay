import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [checkout, setCheckout] = useState('');

  useEffect(() => {
    fetch('/api/hello').then(res => res.json()).then(info => {
      setCheckout(info.url);
    });
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">

        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-4">SEMIPAY - An Open Source Wechat Payment Solution</h1>

          <p className="mb-8">
            Welcome to SEMIPAY, a semi-automatic WeChat payment solution that can be easily deployed privately with a single click on Vercel.
          </p>
          <p className="mb-8">
            It helps create a personal semi-automatic payment collection system and eliminates the need for record filing and transaction fees associated with online payments
          </p>
          <h2 className="text-2xl font-bold my-4">Demo</h2>

          <p className="mb-8 bg-gray-200">
            <span>Testing checkout link: </span>
            <a className='text-blue-800 break-all' target='blank' href={checkout}>{checkout}</a>

          </p>

          <h2 className="text-2xl font-bold my-4">Usage</h2>

          <h3 className="text-xl font-bold my-4">Set up the config</h3>
          <pre className="bg-gray-200 p-4 rounded ">
            <code className='break-all'>
              {`
               // use the following JSON to set up your vercel edge-config
               // https://vercel.com/dashboard/stores/edge-config
                {
                  "qrcode with remark and fixed amount, suggest >5 code": "",
                  "qrcode": [
                    {
                      "url": "https://.co/storage/v1/object/public/static/five1.jpg",
                      "remark": "five1",
                      "price": 5
                    },
                    {
                      "url": "https://.co/storage/v1/object/public/static/five2.jpg",
                      "remark": "five2",
                      "price": 5
                    },
                    {
                      "url": "https://.co/storage/v1/object/public/static/five3.jpg",
                      "remark": "five3",
                      "price": 5
                    }
                  ],
                  "for telegram notify": "",
                  "telegram": "https://api.telegram.org//sendMessage?chat_id=1029979132&",
                  "for email notify": "",                  
                  "email": "you@example.com",
                  "for webhook notify": "",
                  "notifier": "",
                  "your payment website hostname": "",
                  "hostname": "https://payment.vercel.app",
                  "webhook for confirmation":"",
                  "confirmWebhook": "https://pay.findata-be.uk/api/fake?",
                  "secret to create token": "",
                  "secret": "123453"
                }
              `}
            </code>
          </pre>
          <h3 className="text-xl font-bold my-4">To get a checkout link from your business server</h3>
          <pre className="bg-gray-200 p-4 rounded ">
            <code className='break-all'>
              {`
          
          const hostname = 'https://pay.domain';

          const secret = process.env.SECRET;
          const text = Object.keys(info).sort().map(k=> info[k]).join(',');

          const token = createHmac('sha256', secret).update(text).digest('base64');
          const checkout = await fetch(\`\${hostname}/api/checkout\`, {
            method: 'post',
            body: JSON.stringify({...info, token})
          }).then(res=>{
            if(res.status !== 200) throw new Error(res.status);
            return res;
          }).then(res=>res.json());

          console.log(checkout);
`}
            </code>
          </pre>
        </div>
      </div>
    </main>
  )
}
