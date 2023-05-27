import { WechatyBuilder as botBuilder } from 'wechaty'
import { ContactSelfInterface, MessageInterface } from 'wechaty/impls';
import { notifyTelegram } from "./tg-reminder";

export function getBot(messageListener: Array<(msg:MessageInterface)=>Promise<void>>) {
    let myself: ContactSelfInterface;
    const bot = botBuilder.build() // get a Wechaty instance
    bot
        .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))
        .on('login', user => {
            myself = user;
            console.log(`User ${user} logged in`);
        })
        .on('error',async (err) => {
            const text = String(err);
            const skipKeywords = ['AssertionError'];
            if (skipKeywords.includes(text)){
                notifyTelegram(text);
            }
        })
        .on('message', async message => {

            if (message.talker().name() === myself?.name()) {
                return;
            }

            console.log(`${message}`);

            await Promise.all(messageListener.map(fn=>fn(message)))
        })
    return bot
}