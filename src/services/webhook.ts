import { get } from '@vercel/edge-config';

const WEBHOOK_KEY = 'webhook'

export async function callWebhook(info: Record<string, string>) {
    const url = await get(WEBHOOK_KEY);

    const query = new URLSearchParams();
    Object.entries(([k, v]:[string, string]) => {
        query.set(k, v);
    });

    return fetch(`${url}&${query.toString()}`)
}