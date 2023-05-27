import { MessageInterface } from "wechaty/impls";
import fetch from 'node-fetch';
import {config} from 'dotenv';
config();

function escapeString(str:string) {
    return str.replace(/([_*`\[])/g, '\\$1');
  }

  function fnv32a(str:string) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).substring(0, 8)
  }
  
  function wrapLink(e:string, t:'HTML'|'Markdown' = 'Markdown') {
    if (e.startsWith('http')) {
      if (t === 'HTML') {
        return `<a href="${e}">${fnv32a(e)}</a>`
      }
      return `[${fnv32a(e)}](${e})`
    }
    return escapeString(e)
  }
  
export async function notifyTelegram(payload: MessageInterface | string, parse_mode='Markdown',escape = escapeString ) {
    const myself = process.env.MYSELF;
    const bot = process.env.BOT;

    const tt = payload.toString().split('\n').map(e=>wrapLink(e)).join('\n');

    await fetch(`https://api.telegram.org/bot${bot}/sendMessage?chat_id=${myself}&parse_mode=${parse_mode}&text=${encodeURIComponent(tt)}`).then(res => {
        if (res.status !== 200) {
            console.log(res.url);
            throw res;
        }
        return res;
    }).then(res => res.json())

}