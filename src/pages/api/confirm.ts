// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '@/services/get-token';
import { IInfo } from '@/services/notifier';
import { usedToken as recordedToken } from '@/services/otc';
import { fulfillPayment } from '@/services/fulfill-payment';

interface IReqData extends IInfo {
  token: string;
  timestamp: number;
}

type Data = {
  msg: string;
} | string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === 'GET') {


    const info: Omit<IReqData, 'token'> = {
      price: Number(req.query.price),
      user: req.query.user as string,
      extra: req.query.extra as string,
      uid: req.query.uid as string,
      remark: req.query.remark as string,
      timestamp: Number(req.query.timestamp)
    };

    const token = req.query.token as string;

    const codeShouldBe = await getToken(info);


    if (token !== codeShouldBe) return res.status(400).json({ msg: 'wrong token' });

    // should be reused in case of the confirm can not work
    // const stillVaild = await tokenCanBeUsed(token);
    // if (!stillVaild) return res.status(400).json({ msg: 'used token'});
    // await forbidToken(token);
    const confirm = req.query.confirm === 'true';
    if (!confirm) {
      await recordedToken(token);
      return res.status(200).setHeader(
        'content-type', 'text/html'
      ).send(`<div>click <a href="${req.url + '&confirm=true'}">here</a> to confirm</div>`)
    }

    try {
      await fulfillPayment(info);

    } catch (error) {
      return res.status(400).json({ msg: String(error) });

    }
    return res.status(200).json({ msg: 'ok' });

  }
  return res.status(400).json({ msg: 'wrong method' });

}

