// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '@/services/get-token';
import { insertTransaction } from '@/services/db';
import kv from "@vercel/kv";
import { retrieveInfo } from '@/services/otc';
import { fulfillPayment } from '@/services/fulfill-payment';

interface IReqData {
    price: number;
    remark: string;
    timestamp: number;
    transId: string;
    log: string;
}

type Data = {
    msg: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') return res.status(400).json({ msg: 'failed' });
    const { token } = req.query;

    const { price, transId, timestamp, remark, log } = JSON.parse(req.body) as IReqData;

    const codeShouldBe = await getToken({ price, timestamp, remark, log, transId });

    if (token !== codeShouldBe) return res.status(400).json({ msg: 'wrong token' });

    const uid = await kv.get(remark) as string;

    const record = await insertTransaction({
        timestamp, remark, log, transid: transId, price, uid, fulfilled: false
    });

    const info = await retrieveInfo(uid);

    if (!info) return res.status(400).json({ msg: `no info with ${uid}` });

    await fulfillPayment({
        price,
        user:info.user,
        extra: info.extra,
        uid,
        remark
    });
    
    return res.status(200).json({ msg: `${uid}` });
}
