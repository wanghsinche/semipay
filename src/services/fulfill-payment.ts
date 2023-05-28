import { get } from "@vercel/edge-config";
import { isFulfilled, setFullfilled } from '@/services/db';
import { getToken } from "./get-token";
import { sendTelegramComfrimation } from "./notifier";

const SEMIPAY_CONFIRM = 'webhook';
export const donateUser = 'donate@user.com'
interface IInfo {
    price: number;
    user: string;
    extra: string;
    uid: string;
    remark: string;
    timestamp: number;
}

export async function fulfillPayment(info: IInfo) {

    const fulfilled = await isFulfilled(info.uid);
  

    if (fulfilled) return;
  
    const webhook = await get(SEMIPAY_CONFIRM) as string;
    const token = await getToken(info as unknown as Record<string, string>);
  
    if (info.user !== donateUser){
      await fetch(`${webhook}&token=${encodeURIComponent(token)}`, {
        method: 'post',
        body: JSON.stringify(info)
      }).then(r => { if (r.status !== 200) throw r.statusText; return r });  
    }

    await setFullfilled(info.uid);
  
    await sendTelegramComfrimation(info);

  }