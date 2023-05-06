import { get } from '@vercel/edge-config';

const WEBHOOK_KEY = 'webhook'

export async function callWebhook(info: Record<string, string>|string) {
    const url = await get(WEBHOOK_KEY);
    if (typeof info === 'string') {
        console.log(`${url}${info}`)
        return fetch(`${url}${info}`, {
            method: 'get'
        })
    }
    const query = new URLSearchParams();
    Object.entries(info).forEach(([k, v]:[string, string]) => {
        query.set(k, v);
    });
    console.log(`${url}&${query.toString()}`)
    return fetch(`${url}&${query.toString()}`, {
        method: 'get'
    })
}