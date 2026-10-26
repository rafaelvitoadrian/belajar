import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { db, readState, writeState } from '../src/data/database'
import { emptyState } from '../src/data/state'
afterEach(async()=>{await db.state.clear()})
describe('IndexedDB',()=>{
 it('menyimpan dan membaca catatan, progres, dan pengaturan',async()=>{
  const state=emptyState();state.notes.syahadat='Belajar perlahan';state.settings.prayerEnabled=true
  await writeState(state)
  expect(await readState()).toEqual(state)
 })
 it('tidak mengganti snapshot jika penulisan gagal',async()=>{
  const state=emptyState();await writeState(state)
  await expect(db.transaction('r',db.state,async()=>{await writeState({...state,lastLesson:'syahadat'})})).rejects.toThrow()
  expect(await readState()).toEqual(state)
 })
})
