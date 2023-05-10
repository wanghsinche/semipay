# SEMIPAY - An Open Source Wechat Payment Solution

Welcome to SEMIPAY, a semi-automatic WeChat payment solution that can be easily deployed privately with a single click on Vercel.

It helps create a personal semi-automatic payment collection system and eliminates the need for record filing and transaction fees associated with online payments

## Demo

Get testing checkout link: [https://payment-mauve.vercel.app](https://payment-mauve.vercel.app)

## Deploy

Deploy your own payment site on vercel by one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwanghsinche%2Fsemipay.git&env=NODE_ENV&envDescription=%E4%BD%A0%E5%BF%85%E9%A1%BB%E5%85%88%E5%89%8D%E5%BE%80https%3A%2F%2Fvercel.com%2Fdashboard%2Fstores%EF%BC%8C%E5%88%9B%E5%BB%BA%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84KV%E5%92%8Cedge%20config%2C%20%E5%B9%B6%E5%A1%AB%E5%85%A5%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AF.%20%20%E5%8F%AF%E5%8F%82%E8%80%83%20%20https%3A%2F%2Fpayment-mauve.vercel.app%2F%20%20%5Cn%20You%20created%20the%20KV%20and%20edge%20config%20in%20storage%20page.&envLink=https%3A%2F%2Fvercel.com%2Fdashboard%2Fstores&demo-title=SEMIPAY&demo-description=SEMIPAY%20-%20An%20Open%20Source%20Wechat%20Payment%20Solution&demo-url=https%3A%2F%2Fpayment-mauve.vercel.app%2F)

## Usage

### Set up the config

use the following JSON to set up your vercel edge-config
https://vercel.com/dashboard/stores/edge-config

```json
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
```

### To get a checkout link from your business server

```js
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


const checkout = await fetch(`${hostname}/api/checkout`, {
    method: 'post',
    body: JSON.stringify({...info, token})
}).then(res=>{
    if(res.status !== 200) throw new Error(res.status);
    return res;
}).then(res=>res.json());

// get the checkout url
console.log(checkout);
```

## Development
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
