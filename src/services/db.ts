import { createKysely } from "@vercel/postgres-kysely";
import { Generated } from 'kysely';
import { duration } from "./id-generator";
interface ITransactionTable {
    id: Generated<number>;
    price: number;
    remark: string;
    timestamp: number;
    transid: string;
    log: string;
    uid: string;
    fulfilled: boolean;
}

interface Database {
    transaction: ITransactionTable; // see github.com/kysely-org/kysely
}

const db = createKysely<Database>();

export interface ITransaction extends Omit<ITransactionTable, 'id'> {

}

export async function insertTransaction(v: ITransaction) {
    const record = await db
        .insertInto('transaction')
        .values({
            ...v
        })
        .executeTakeFirst();
    return record
}

export async function queryTransaction(remark: string, timestamp: number) {
    const record = await db
        .selectFrom('transaction')
        .where('remark', '=', remark)
        .where('timestamp', '>=', timestamp)
        .where('timestamp', '<', timestamp + duration)
        .select(['id', 'remark', 'price'])
        .executeTakeFirst();
    return record
}

export async function isFulfilled(uid: string) {
    
    const record = await db
        .selectFrom('transaction')
        .where('uid', '=', uid)
        .where('fulfilled', '=', true)
        .select(['uid', 'fulfilled', 'price', 'remark'])
        .executeTakeFirst();
    return record?.fulfilled
}

export async function setFullfilled(uid: string) {
    const record = await db.updateTable('transaction')
        .set({ fulfilled: true })
        .where('uid', '=', uid)
        .executeTakeFirst();
    return record;
}