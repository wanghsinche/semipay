# SEMIPAY - An Open Source Wechat Payment Solution

Welcome to SEMIPAY, a semi-automatic WeChat payment solution that can be easily deployed privately with a single click on Vercel.

It helps create a personal semi-automatic payment collection system and eliminates the need for record filing and transaction fees associated with online payments

## Demo

Testing checkout link: [https://payment-mauve.vercel.app
/api/hello](https://payment-mauve.vercel.app
/api/hello)

## Usage

### Set up the config

```
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
    "telegram": "https://api.telegram.org//sendMessage?chat_id=1029979132&amp;",
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
```

### To get a checkout link from your business server

```
const hostname = 'https://pay.domain';

const secret = process.env.SECRET;
const text = Object.keys(info).sort().map(k=> info[k]).join(',');

const token = createHmac('sha256', secret).update(text).digest('base64');
const checkout = await fetch(`${hostname}/api/checkout`, {
    method: 'post',
    body: JSON.stringify({...info, token})
}).then(res=>{
    if(res.status !== 200) throw new Error(res.status);
    return res;
}).then(res=>res.json());

console.log(checkout);
```


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
