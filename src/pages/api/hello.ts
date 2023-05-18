// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getToken } from '@/services/get-token';
import { get } from '@vercel/edge-config';
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHmac } from 'node:crypto';

type Data = {
  msg: string;
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const info:Record<string, string|number> = {
    price: 5,
    user: 'donate@user.com',
    extra: 'donate',
    timestamp: Date.now()
  }
  const hostname = await get('hostname') as string;

  const secret = await get('secret') as string;
  const text = Object.keys(info).sort().map(k=>info[k]).join(',');

  const token = createHmac('sha256', secret).update(text).digest('base64');
  const checkout = await fetch(`${hostname}/api/checkout`, {
    method: 'post',
    body: JSON.stringify({...info, token})
  }).then(res=>{
    console.log(res.status)
    return res;
  }).then(res=>res.json());

  const url = new URL(checkout.url);
  return res.status(200).json({msg: 'ok', url: url.pathname+url.search});

}
