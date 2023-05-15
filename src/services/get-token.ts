import { get } from '@vercel/edge-config';
import { createHmac } from 'node:crypto';
export async function getToken(info: Record<string, number|string>) {
    const secret = await get('secret') as string;
    const text = Object.keys(info).sort().map(k=>info[k]).join(',');

    const code = createHmac('sha256', secret).update(text).digest('base64');
    console.log('token generate', text, code, secret);
    return code
}