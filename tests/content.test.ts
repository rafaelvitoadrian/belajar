import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { lessons, loadLessons, parseLesson } from '../src/data/content'
import sample from '../content/lessons/syahadat.json'
describe('pemuat konten', () => {
  it('memuat dua template lengkap dengan rujukan dan kuis', () => {
    expect(lessons).toHaveLength(2)
    for (const lesson of lessons) {
      expect(lesson.body.length).toBeGreaterThan(100)
      expect(lesson.sumber.length).toBeGreaterThan(0)
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(3)
      expect(lesson.review.status).toBe('perlu-ditinjau')
    }
  })
  it('menolak materi tanpa sumber atau isi', () => {
    expect(() => parseLesson({...sample, sumber: []}, 'Isi')).toThrow()
    expect(() => parseLesson(sample, '')).toThrow()
  })
  it('menolak jawaban di luar pilihan dan rujukan palsu', () => {
    expect(() => parseLesson({...sample, quiz: sample.quiz.map(q => ({...q, answer: 50}))}, 'Isi')).toThrow()
    expect(() => parseLesson({...sample, quiz: sample.quiz.map(q => ({...q, sourceIds: ['tidak-ada']}))}, 'Isi')).toThrow()
  })
  it('menolak status terverifikasi tanpa guru dan tanggal', () => {
    expect(() => parseLesson({...sample, review: {status: 'terverifikasi'}}, 'Isi')).toThrow()
  })
  it('menolak file Markdown hilang dan ID duplikat', () => {
    expect(() => loadLessons({'/a.json':sample}, {})).toThrow()
    expect(() => loadLessons({'/a.json':sample, '/b.json':sample}, {'/a.md':'Isi','/b.md':'Isi'})).toThrow()
  })
})
it('menghubungkan setiap bacaan dan materi tersedia ke rencana yang sesuai',async()=>{
 const {stages,readings}=await import('../src/data/content')
 expect(stages.flatMap(s=>s.lessonIds)).toHaveLength(18)
 for(const lesson of lessons)expect(stages.find(s=>s.id===lesson.stageId)?.lessonIds).toContain(lesson.id)
 for(const reading of readings){expect(lessons.find(l=>l.id===reading.lessonId)?.readingIds).toContain(reading.id);if(reading.audio)expect(existsSync(resolve('.'+reading.audio.path))).toBe(true)}
})
