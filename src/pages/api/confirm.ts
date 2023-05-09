// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from '@vercel/edge-config';
import { getToken } from '@/services/get-token';
import { IInfo } from '@/services/notifier';
import { forbidToken, tokenCanBeUsed } from '@/services/otc';
interface IReqData extends IInfo {
    token: string;
    timestamp: number;
}

type Data = {
    msg: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method!=='GET') return   res.status(400).json({ msg: 'failed'});

  const SEMIPAY_CONFIRM = 'confirmWebhook';

  const info:Omit<IReqData, 'token'> = {
      price: Number(req.query.price),
      user: req.query.user as string,
      extra: req.query.extra as string,
      uid: req.query.uid as string,
      remark: req.query.remark as string,
      timestamp: Number(req.query.timestamp)
  };

  console.log(req.query, req.url, info);

  const token = req.query.token as string;

  const codeShouldBe = await getToken(info);


  if (token !== codeShouldBe) return res.status(400).json({ msg: 'wrong token'});

  // should be reused in case of the confirm can not work
  // const stillVaild = await tokenCanBeUsed(token);
  // if (!stillVaild) return res.status(400).json({ msg: 'used token'});
  // await forbidToken(token);

  const confirmWebhook = await get(SEMIPAY_CONFIRM) as string;

  try {
    await fetch(`${confirmWebhook}&token=${token}`, {
        method: 'post',
        body: JSON.stringify(info)
    }).then(r=>{if(r.status!==200)throw r.statusText; return r});
      
  } catch (error) {
    return res.status(400).json({ msg: String(error)});        
  }

  return res.status(200).json({ msg: 'ok'});
}
