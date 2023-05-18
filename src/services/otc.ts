import kv from "@vercel/kv";
import { randomUUID } from 'node:crypto';
import { duration as remarkDuration } from './id-generator';

const UidDuration = 24 * 3600 // sec, max duration is 24hrs


export async function getOTC(price: number, user: string, extra: string){
    const uid = randomUUID();
    await kv.set(uid, {uid, price, user, extra, remark: '', timestamp: Date.now()}, {
        ex: UidDuration
    });
    return {uid, expiry: Date.now() + 1000 * UidDuration};
}

export async function retrieveInfo(uid: string) {
    const info = await kv.get(uid)  as { uid: string, price: number, user: string, extra: string, remark: string, timestamp: number}| null;
    
    return info;
}


export async function updateRemark(uid: string, remark: string) {
    const info = await retrieveInfo(uid)    
    if (!info) return;
    info.remark = remark;
    info.timestamp = Date.now();
    // update the expiration 
    await kv.set(uid, info, {
        ex: remarkDuration
    });

    // bind the uid to the remark
    await kv.set(remark, uid, {
        ex: remarkDuration
    })
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