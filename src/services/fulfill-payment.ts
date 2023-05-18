import { get } from "@vercel/edge-config";
import { isFulfilled, setFullfilled } from '@/services/db';
import { getToken } from "./get-token";
import { sendReceipt } from "./notifier";

const SEMIPAY_CONFIRM = 'confirmWebhook';
const donateUser = 'donate@user.com'
interface IInfo {
    price: number;
    user: string;
    extra: string;
    uid: string;
    remark: string;
}

export async function fulfillPayment(info: IInfo) {

    const fulfilled = await isFulfilled(info.uid);
  

    if (fulfilled) return;
  
    const confirmWebhook = await get(SEMIPAY_CONFIRM) as string;
    const token = await getToken(info as unknown as Record<string, string>);
  
    if (info.user === donateUser){
      await setFullfilled(info.uid);
      return
    }

    await fetch(`${confirmWebhook}&token=${encodeURIComponent(token)}`, {
      method: 'post',
      body: JSON.stringify(info)
    }).then(r => { if (r.status !== 200) throw r.statusText; return r });
  
    await setFullfilled(info.uid);
  
    await sendReceipt(info)

  }