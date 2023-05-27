// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isFulfilled } from '@/services/db';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  msg: string;
  status: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const uid = req.query.uid as string;

    const status = await isFulfilled(uid);

    return res.status(200).send({
        msg: 'ok', status: Boolean(status)
    })

}