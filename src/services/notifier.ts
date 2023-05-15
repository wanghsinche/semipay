import { get } from '@vercel/edge-config';
import { getToken } from './get-token';
import nodemailer from 'nodemailer';

const SEMIPAY_EMAIL = 'email'
const SEMIPAY_TG = 'telegram'
const SEMIPAY_HOSTNAME = 'hostname'
const SEMIPAY_NOTIFIER = 'notifier'

export interface IInfo {
    price: number;
    user: string;
    extra: string;
    uid: string;
    remark: string;
}

export async function sendMsg(info: IInfo) {
    const notifier = await get(SEMIPAY_NOTIFIER);
    const email = await get(SEMIPAY_EMAIL);

    if (notifier) return notify(info);
    if (email) return sendEmail(info);
    return sendTelegram(info);
}

async function notify(info: IInfo) {
    const url = await get(SEMIPAY_NOTIFIER);

    const data = {
        ...info,
        timestamp: Date.now()
    };

    const token = await getToken(data);


    return fetch(`${url}&token=${token}`, {
        method: 'post',
        body: JSON.stringify(data),
    });

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

async function sendEmail(info: IInfo){
    const { user, remark, price, extra, uid} = info;
    const email = await get(SEMIPAY_EMAIL) as string;
    const hostname = await get(SEMIPAY_HOSTNAME) as string;
    const approval = await getConfirmLink(info);
    const basename = hostname.replace(/https?:\/\//, '');
    const msg = `
    A checkout was placed
    <ul>
       <li>user: ${user}</li>
       <li>price: ${price}</li>
       <li>remark: ${remark}</li>
       <li>extra: ${extra}</li>
       <li>uid: ${uid}</li>
    </ul>
    click <a href="${approval}"> ${approval}</a> to confirm the payment
    `;

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    // https://ethereal.email/create
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ernestina.deckow@ethereal.email',
            pass: '9hRMmM298Xf214ga8j'
        }
    });
      
    // send mail with defined transport object
    let res = await transporter.sendMail({
      from: `noreply@${basename}`, // sender address
      to: email, // list of receivers
      subject: "[SEMIPAY] A checkout was placed", // Subject line
      html: msg, // html body
    });
  
    console.log("Message sent: %s", res.messageId);
  

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