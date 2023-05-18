import { getBot } from './bot';
import {semipayBot} from './payment-bot';
import {wx2tgBot} from './wx-tg-bot';

if (require.main===module){
    getBot([semipayBot, wx2tgBot]).start();
}