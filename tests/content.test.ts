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
