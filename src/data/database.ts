import Dexie, { type EntityTable } from 'dexie'
import type { LearningState } from './state'
export const db = new Dexie('belajar-islam') as Dexie & { state: EntityTable<{id:string; value:LearningState}, 'id'> }
db.version(1).stores({state:'id'})
export async function readState() { return (await db.state.get('personal'))?.value }
export async function writeState(value:LearningState) { await db.state.put({id:'personal', value}) }
