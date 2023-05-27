import { MessageInterface } from "wechaty/impls";
import * as PUPPET from 'wechaty-puppet'
import { readFileSync } from "fs";
import { formatter } from "./formatter";
import { notifyTelegram } from "./tg-reminder";

export async function wx2tgBot(message:MessageInterface) {
    if (!process.env.wx2tgbot) {
        return;
    }

    const rulePath = process.env.RULEPATH;

    let text = message.toString();

    if ([PUPPET.types.Message.Url, PUPPET.types.Message.Transfer, PUPPET.types.Message.RedEnvelope, PUPPET.types.Message.Unknown].includes(message.type())) {
        text = text + '\n' + await formatter(message.payload?.text || '');
    }

    if (!rulePath) {
        await notifyTelegram(text);
        return;
    }

    const rule = JSON.parse(readFileSync(rulePath, { encoding: 'utf8' })) as {
        whitelist: string[],
        blacklist: string[]
    };

    if (rule.whitelist.some(r => message.toString().includes(r))) {
        await notifyTelegram(text);
        return
    }

    if (rule.blacklist.some(r => message.toString().includes(r))) {
        return
    }
    await notifyTelegram(text);
}