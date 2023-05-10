import kv from "@vercel/kv";
import { randomUUID } from 'node:crypto';

const UidDuration = 24 * 3600 // sec, max duration is 24hrs


export async function getOTC(price: number, user: string, extra: string){
    const uid = randomUUID();
    await kv.set(uid, {price, user, extra}, {
        ex: UidDuration
    });
    return {uid, expiry: Date.now() + 1000 * UidDuration};
}

export async function retrieveInfo(uid: string) {
    const info = await kv.get(uid)  as { price: number, user: string, extra: string}| null;
    
    return info;
}

export async function expireUID(uid: string) {
    await kv.del(uid);
    return uid;
}

export async function firstTimeToken(token: string) {
    const res = await kv.get(token);
    return !res;
}

export async function usedToken(token: string) {
    await kv.set(token, true, {
        ex: UidDuration
    })
}