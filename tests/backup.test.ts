import { describe, expect, it } from 'vitest'
import { createBackup, parseBackup } from '../src/data/backup'
import { emptyState } from '../src/data/state'
import { normalizeSearch } from '../src/lib/search'
describe('cadangan dan pencarian',()=>{
 it('memulihkan semua jenis data melalui ekspor/impor',()=>{
  const data=emptyState();data.settings.name='Aminah';data.notes.syahadat='Catatan pribadi';data.favorites=['syahadat'];data.wrongQuestions=['syahadat-1'];data.reviews.bismillah={level:1,due:'2026-10-27',lastReviewed:'2026-10-26'}
  data.days['2026-10-26']={seconds:142,goals:['read'],prayers:['Subuh']};data.questions=[{id:'1',text:'Bagaimana?',answer:'',answered:false,createdAt:new Date().toISOString(),lessonId:'syahadat'}]
  expect(parseBackup(JSON.stringify(createBackup(data)))).toEqual(data)
 })
 it('menolak JSON rusak, versi asing, nilai palsu, dan isi berlebihan',()=>{
  expect(()=>parseBackup('{rusak')).toThrow()
  expect(()=>parseBackup(JSON.stringify({...createBackup(emptyState()),version:2}))).toThrow()
  const bad=emptyState();bad.days['2026-02-30']={seconds:-1,goals:[],prayers:[]}
  expect(()=>parseBackup(JSON.stringify({format:'belajar-islam',version:1,exportedAt:new Date().toISOString(),data:bad}))).toThrow()
  expect(()=>parseBackup(' '.repeat(5*1024*1024+1))).toThrow()
 })
 it('menolak referensi materi tidak dikenal tanpa mengubah data asal',()=>{
  const original=emptyState();const raw=createBackup(original);raw.data.notes['materi-asing']='Isi'
  expect(()=>parseBackup(JSON.stringify(raw))).toThrow('materi')
  expect(original.notes).toEqual({})
 })
 it('mencari transliterasi beraksen dan Arab tanpa harakat',()=>{
  expect(normalizeSearch('Ar-Raḥīm')).toBe('ar-rahim')
  expect(normalizeSearch('بِسْمِ اللَّهِ')).toBe(normalizeSearch('بسم الله'))
 })
})
