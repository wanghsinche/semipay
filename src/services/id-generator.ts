import kv from "@vercel/kv";
import { get } from '@vercel/edge-config';

export const QRCODE_KEY = 'qrcode';
export const ID_LIST_KEY = 'payment_id_list';
export const duration = 1000 * 60 * 2; // 2min
export const oneYear = 1000 * 3600 * 24 * 360
export interface IConfig {
    url: string;
    remark: string;
    price: number;
}

export async function generateCheckout(price?:number) {
    const config = await get<IConfig[]>(QRCODE_KEY);
    const idPool = config?.filter(el=> !price || el.price === price).map(el => el.remark);
    if (!idPool?.length) throw 'can not read a valid config';
    if (idPool.length < 3) {
        console.warn('The ID Pool is too small');
    }
    const now = Date.now();
    const lockedIds = await kv.zrange<string[]>(ID_LIST_KEY, now, now + oneYear, {
        byScore: true
    });
    const freeId = idPool.find(id => !lockedIds.includes(id));
    if (!freeId) return null;
    await kv.zadd(ID_LIST_KEY, { score: now + duration, member: freeId });

    return config?.find(el => el.remark === freeId);
}
