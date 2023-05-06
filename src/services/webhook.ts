import { get } from '@vercel/edge-config';

const WEBHOOK_KEY = 'webhook'

export async function callWebhook(info: Record<string, string>|string) {
    const url = await get(WEBHOOK_KEY);
    if (typeof info === 'string') {
        return fetch(`${url}${info}`)
    }
    const query = new URLSearchParams();
    Object.entries(([k, v]:[string, string]) => {
        query.set(k, v);
    });

    return fetch(`${url}&${query.toString()}`)
}