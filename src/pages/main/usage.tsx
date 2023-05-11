import React from 'react';

export default function Usage() {
    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">Usage</h2>
            <p className="mb-4">
                To use SEMIPAY, you first need to set up the configuration using the following JSON, which you can add to your Vercel edge-config:
            </p>
            <pre className="bg-gray-100 rounded-md p-4 text-sm overflow-auto">
                {`{
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
}`}
            </pre>
            <p className="mb-4">
                Once you&apos;ve set up the configuration, you can get a checkout link from your business server by sending a POST request to the SEMIPAY API endpoint at <code>https://your.pay.domain/api/checkout</code> with the following parameters:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li><code>price</code>: The price of the item being sold</li>
                <li><code>user</code>: The email address of the user making the purchase</li>
                <li><code>extra</code>: Any extra information to be included in the purchase</li>
                <li><code>timestamp</code>: The timestamp of the purchase (in milliseconds since the epoch)</li>
                <li><code>token</code>: A SHA256 hash of the parameters (excluding <code>token</code>) using the <code>secret</code> value from your configuration as the key</li>
            </ul>
            <p className="mb-4">
                Here&apos;s an example of how to get a checkout link:
            </p>
            <pre className="bg-gray-100 rounded-md p-4 text-sm overflow-auto">
                {`const hostname = 'https://your.pay.domain';

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
  if(res.status !== 200) throw new
`}
            </pre>
        </section>);
}