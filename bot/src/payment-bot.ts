import * as PUPPET from 'wechaty-puppet'
import { MessageInterface } from 'wechaty/impls'
import { notifyTelegram } from './tg-reminder';
import { createHmac } from 'node:crypto';
import fetch from 'node-fetch';

export function formatPayment(msg: MessageInterface): IPayment | undefined {
    const timestamp = msg.payload?.timestamp;
    const documentText = msg.payload?.text as string;
    const type = msg.payload?.type;

    if (type !== PUPPET.types.Message.Url) return void 0;
    if (!documentText.includes('<![CDATA[微信支付]]>') || !documentText.includes('收款金额')) return void 0;


    const amountPattern = /收款金额￥([\d.,]+)/;
    const remarkPattern = /收款方备注(.+)/;
    const transIdPattern = /trans_id=(\d+)/;

    const amountMatch = documentText.match(amountPattern);
    const remarkMatch = documentText.match(remarkPattern);
    const transIdMatch = documentText.match(transIdPattern);

    const amount = amountMatch ? amountMatch[1] : void 0;
    const remark = remarkMatch ? remarkMatch[1] : void 0;
    const transId = transIdMatch ? transIdMatch[1] : void 0;

    return {
        amount: amount, remark, transId, timestamp
    }
}

export interface IPayment {
    amount?: string;
    remark?: string;
    transId?: string;
    timestamp?: number
}

export async function onPaid(pay: IPayment, log: string) {

    await notifyTelegram(`
*Received ${pay.amount}*
Remark: ${pay.remark}
timestamp: ${new Date((pay.timestamp as number) * 1000).toUTCString()}
transId: ${pay.transId}
        `);


    // save the transaction

    const info = { price: parseFloat(pay.amount as string), transId: pay.transId, timestamp: (pay.timestamp as number) * 1000, remark: pay.remark, log };

    const text = Object.keys(info)
        .sort()
        .map((k) => (info as any)[k])
        .join(',');

    const secret = process.env.SECRET as string;
    const gateway = process.env.GATEWAY as string;

    const token = createHmac('sha256', secret).update(text).digest('base64');

    
    const resText = await fetch(`${gateway}/api/transaction?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        body: JSON.stringify(info)
    }).then(res => {
        if (res.status !== 200) {
            console.log(res.url, res.status, info);
        }
        return res.text();
    })

    console.log(resText);
    console.log('saved record');

}


export async function semipayBot(message: MessageInterface) {
    const payment = formatPayment(message);
    if (payment) {
        console.log(JSON.stringify(message));
        await onPaid(payment, JSON.stringify(message));
        return;
    }

}