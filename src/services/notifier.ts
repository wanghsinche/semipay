import { get } from '@vercel/edge-config';
import { getToken } from './get-token';

const SEMIPAY_TG = 'telegram'
const SEMIPAY_HOSTNAME = 'hostname'

export interface IInfo {
    price: number;
    user: string;
    extra: string;
    uid: string;
    remark: string;
}

export async function sendMsg(info: IInfo) {

    return sendTelegram(info);
}


async function getConfirmLink(info: IInfo){
    const hostname = await get(SEMIPAY_HOSTNAME);
    const data = {
        ...info,
        timestamp: Date.now()
    };
    const token = await getToken(data);
    const query = new URLSearchParams();

    Object.entries(data).forEach(([k, v]:[string, string|number]) => {
        query.set(k, String(v));
    });
    query.set('token', token);

    return `${hostname}/api/confirm?${query.toString()}`;
}


async function sendTelegram(info: IInfo){
    const { user, remark, price, extra, uid} = info;
    const tg = await get(SEMIPAY_TG);
    const approval = await getConfirmLink(info);
    const msg = `
    * A checkout was placed *
    
    -user: ${user}
    -price: ${price}
    -remark: ${remark}
    -extra: ${extra}
    -uid: ${uid}

    click [here](${approval}) to confirm the payment
    `;
    await fetch(`${tg}&parse_mode=markdown&text=${encodeURIComponent(msg)}`)
}

export async function sendTelegramComfrimation(info: IInfo){
    const { user, remark, price, extra, uid} = info;
    const tg = await get(SEMIPAY_TG);
    const msg = `
    * The payment has been comfirmed *
    
    -user: ${user}
    -price: ${price}
    -remark: ${remark}
    -extra: ${extra}
    -uid: ${uid}

    `;
    await fetch(`${tg}&parse_mode=markdown&text=${encodeURIComponent(msg)}`)
}

