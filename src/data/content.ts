import { z } from 'zod'

const sourceSchema = z.object({ id: z.string().min(1), title: z.string().min(1), url: z.url().refine(v => v.startsWith('https://'), 'Sumber harus menggunakan HTTPS'), narrator: z.string().optional(), note: z.string().optional() })
const termSchema = z.object({ id: z.string(), arabic: z.string(), transliteration: z.string(), meaning: z.string(), sourceIds: z.array(z.string()).min(1) })
const questionSchema = z.object({ id: z.string().min(1), prompt: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(5), answer: z.number().int().min(0), explanation: z.string().min(1), sourceIds: z.array(z.string()).min(1) }).refine(q => q.answer < q.options.length, 'Jawaban di luar pilihan')
const lessonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), title: z.string().min(1), stageId: z.number().int().min(1).max(6), minutes: z.number().min(5).max(10), summary: z.string().min(1),
  review: z.object({ status: z.enum(['perlu-ditinjau', 'terverifikasi']), reviewer: z.string().optional(), date: z.string().optional() }),
  sumber: z.array(sourceSchema).min(1), terms: z.array(termSchema).min(1), quiz: z.array(questionSchema).min(3).max(5), readingIds: z.array(z.string()), differences: z.string().optional()
}).superRefine((lesson, ctx) => {
  if (lesson.review.status === 'terverifikasi' && (!lesson.review.reviewer || !lesson.review.date)) ctx.addIssue({ code: 'custom', message: 'Tinjauan memerlukan nama guru dan tanggal' })
  const sources = new Set(lesson.sumber.map(s => s.id))
  for (const item of [...lesson.terms, ...lesson.quiz]) if (item.sourceIds.some(id => !sources.has(id))) ctx.addIssue({ code: 'custom', message: 'Rujukan sumber tidak ditemukan' })
  if (new Set(lesson.quiz.map(q => q.id)).size !== lesson.quiz.length) ctx.addIssue({ code: 'custom', message: 'ID soal duplikat' })
})
export type Lesson = z.infer<typeof lessonSchema> & { body: string }
export type Question = Lesson['quiz'][number]
export type Term = Lesson['terms'][number]
export type Stage = { id: number; title: string; description: string; topics: string[] }
export type Reading = { id: string; title: string; arabic: string; transliteration: string; meaning: string; review: 'perlu-ditinjau'; lessonId: string; source: { title: string; url: string }; audio: null | { path: string; reciter: string; sourceUrl: string } }

export function parseLesson(raw: unknown, body: string): Lesson {
  const lesson = lessonSchema.parse(raw)
  if (!body.trim()) throw new Error(`Teks pelajaran ${lesson.id} kosong`)
  return { ...lesson, body }
}
export function loadLessons(jsonFiles: Record<string, unknown>, markdownFiles: Record<string, string>): Lesson[] {
  const lessons = Object.entries(jsonFiles).map(([path, data]) => parseLesson(data, markdownFiles[path.replace(/\.json$/, '.md')] ?? ''))
  if (new Set(lessons.map(l => l.id)).size !== lessons.length) throw new Error('ID pelajaran duplikat')
  return lessons.sort((a, b) => a.stageId - b.stageId || a.id.localeCompare(b.id))
}
export const lessons = loadLessons(import.meta.glob('/content/lessons/*.json', { eager: true, import: 'default' }), import.meta.glob('/content/lessons/*.md', { eager: true, query: '?raw', import: 'default' }))
import curriculum from '../../content/curriculum.json'
import readingsData from '../../content/readings.json'
export const stages: Stage[] = curriculum
export const readings = readingsData as Reading[]
export const terms = Array.from(new Map(lessons.flatMap(l => l.terms).map(t => [t.id, t])).values())
