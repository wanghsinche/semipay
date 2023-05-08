// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getOTC } from '@/services/otc';
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from '@vercel/edge-config';
import { getToken } from '@/services/get-token';

interface IReqData {
    price: number;
    user: string;
    extra: string;
    timestamp: number;
    token: string;
}

type Data = {
    url?: string;
    expiry?: number;
    uid?: string;
    msg: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method!=='POST') return   res.status(400).json({ msg: 'failed'});
  console.log('before price')

  const { price, user, timestamp, extra, token} = JSON.parse(req.body) as IReqData;
  console.log('price', price)
  const hostname = await get('hostname') as string;

  const codeShouldBe = await getToken({price, user, timestamp, extra});

  if (token !== codeShouldBe) return res.status(400).json({ msg: 'wrong token'});

  const info = await getOTC(price, user, extra);

  return res.status(200).json({ msg: 'ok', url:`${hostname}/semipay?uid=${info.uid}`, expiry: info.expiry, uid: info.uid});
}
