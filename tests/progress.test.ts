import { describe, expect, it } from 'vitest'
import { isCompleted, progressPercent, streakStats } from '../src/lib/progress'
import { addDays, isCalendarDate, lastSevenDays } from '../src/lib/dates'
describe('progres',()=>{
  it('baru selesai setelah dibaca DAN kuis dikerjakan',()=>{
    expect(isCompleted()).toBe(false)
    expect(isCompleted({readAt:'2026-01-01',quizAt:null,attempts:0,bestScore:0})).toBe(false)
    expect(isCompleted({readAt:null,quizAt:'2026-01-01',attempts:1,bestScore:100})).toBe(false)
    expect(isCompleted({readAt:'2026-01-01',quizAt:'2026-01-01',attempts:1,bestScore:33})).toBe(true)
  })
  it('menghitung keseluruhan rencana tanpa pembagian nol',()=>{
    expect(progressPercent(2,18)).toBe(11)
    expect(progressPercent(0,0)).toBe(0)
    expect(progressPercent(20,18)).toBe(100)
  })
  it('mempertahankan ritme terbaik meski ada hari terlewat',()=>{
    expect(streakStats(['2026-01-01','2026-01-02','2026-01-03','2026-01-05'],'2026-01-05')).toEqual({current:1,best:3,totalDays:4})
    expect(streakStats(['2026-01-01','2026-01-02'],'2026-01-03').current).toBe(2)
    expect(streakStats(['2026-01-01','2026-01-02'],'2026-01-05')).toEqual({current:0,best:2,totalDays:2})
  })
  it('mengabaikan duplikat dan tanggal masa depan',()=>{
    expect(streakStats(['2026-01-01','2026-01-01','2026-01-30'],'2026-01-01')).toEqual({current:1,best:1,totalDays:1})
  })
  it('mendukung pergantian bulan dan tahun kabisat',()=>{
    expect(addDays('2024-02-28',1)).toBe('2024-02-29')
    expect(addDays('2025-12-31',1)).toBe('2026-01-01')
    expect(isCalendarDate('2026-02-30')).toBe(false)
    expect(lastSevenDays('2026-01-03')).toHaveLength(7)
    expect(lastSevenDays('2026-01-03')[0]).toBe('2025-12-28')
  })
})
