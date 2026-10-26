import { describe, expect, it } from 'vitest'
import { isDue, scheduleReview } from '../src/lib/spacedRepetition'
describe('pengulangan terjadwal',()=>{
 it('hafalan pertama dijadwalkan besok',()=>{expect(scheduleReview(undefined,true,'2026-12-31')).toEqual({level:1,due:'2027-01-01',lastReviewed:'2026-12-31'})})
 it('memperpanjang interval 1, 3, 7, 14, dan 30 hari',()=>{
   let state=scheduleReview(undefined,true,'2026-01-01')
   expect(state.due).toBe('2026-01-02')
   state=scheduleReview(state,true,'2026-01-02');expect(state.due).toBe('2026-01-05')
   state=scheduleReview(state,true,'2026-01-05');expect(state.due).toBe('2026-01-12')
   state=scheduleReview(state,true,'2026-01-12');expect(state.due).toBe('2026-01-26')
   state=scheduleReview(state,true,'2026-01-26');expect(state.due).toBe('2026-02-25')
   state=scheduleReview(state,true,'2026-02-25');expect(state.level).toBe(5);expect(state.due).toBe('2026-03-27')
 })
 it('mengulang besok jika belum lancar, tanpa penalti lain',()=>{
   expect(scheduleReview({level:5,due:'2026-02-01',lastReviewed:'2026-01-01'},false,'2026-01-31')).toEqual({level:0,due:'2026-02-01',lastReviewed:'2026-01-31'})
 })
 it('menyertakan hafalan terlambat dan mengecualikan yang belum dijadwalkan',()=>{
   expect(isDue(undefined,'2026-01-01')).toBe(false)
   expect(isDue({level:1,due:'2026-01-01',lastReviewed:'2025-12-31'},'2026-01-01')).toBe(true)
   expect(isDue({level:1,due:'2026-01-01',lastReviewed:'2025-12-31'},'2026-01-03')).toBe(true)
   expect(isDue({level:1,due:'2026-01-04',lastReviewed:'2026-01-03'},'2026-01-03')).toBe(false)
 })
})
it('latihan berulang dalam satu hari tidak melompati interval',()=>{
 const first=scheduleReview(undefined,true,'2026-01-01')
 expect(scheduleReview(first,true,'2026-01-01')).toEqual(first)
})
