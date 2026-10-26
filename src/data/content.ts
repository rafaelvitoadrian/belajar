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
export type Stage = { id: number; title: string; description: string; topics: string[]; lessonIds: string[] }
export type Reading = { id: string; title: string; arabic: string; transliteration: string; meaning: string; review: 'perlu-ditinjau'; lessonId: string; source: { title: string; url: string }; audio: null | { path: string; reciter: string; sourceUrl: string } }

export function parseLesson(raw: unknown, body: string): Lesson {
  const lesson = lessonSchema.parse(raw)
  if (!body.trim()) throw new Error(`Teks pelajaran ${lesson.id} kosong`)
  return { ...lesson, body }
}
export function loadLessons(jsonFiles: Record<string, unknown>, markdownFiles: Record<string, string>): Lesson[] {
  const lessons = Object.entries(jsonFiles).map(([path, data]) => parseLesson(data, markdownFiles[path.replace(/\.json$/, '.md')] ?? ''))
  if (new Set(lessons.map(l => l.id)).size !== lessons.length) throw new Error('ID pelajaran duplikat')
  const questionIds=lessons.flatMap(l=>l.quiz.map(q=>q.id))
  if(new Set(questionIds).size!==questionIds.length)throw new Error('ID soal harus unik di seluruh koleksi')
  return lessons.sort((a, b) => a.stageId - b.stageId || a.id.localeCompare(b.id))
}
const loadedLessons = loadLessons(import.meta.glob('/content/lessons/*.json', { eager: true, import: 'default' }), import.meta.glob('/content/lessons/*.md', { eager: true, query: '?raw', import: 'default' }))
import curriculum from '../../content/curriculum.json'
import readingsData from '../../content/readings.json'
const stageSchema=z.object({id:z.number().int().min(1).max(6),title:z.string().min(1),description:z.string().min(1),topics:z.array(z.string().min(1)).min(2),lessonIds:z.array(z.string().regex(/^[a-z0-9-]+$/)).min(2)}).refine(stage=>stage.topics.length===stage.lessonIds.length,'Topik dan ID rencana harus berpasangan')
export const stages: Stage[] = z.array(stageSchema).length(6).parse(curriculum)
if(new Set(stages.map(s=>s.id)).size!==6 || stages.some((s,i)=>s.id!==i+1))throw new Error('Tahap harus berurutan 1 hingga 6')
const plannedIds=stages.flatMap(s=>s.lessonIds)
if(new Set(plannedIds).size!==plannedIds.length)throw new Error('ID rencana pelajaran duplikat')
export const lessons=loadedLessons.sort((a,b)=>plannedIds.indexOf(a.id)-plannedIds.indexOf(b.id))
for(const lesson of lessons)if(!stages.find(s=>s.id===lesson.stageId)?.lessonIds.includes(lesson.id))throw new Error(`Pelajaran ${lesson.id} tidak terdaftar di tahap yang benar`)
const readingSchema=z.object({id:z.string().regex(/^[a-z0-9-]+$/),title:z.string().min(1),arabic:z.string().min(1),transliteration:z.string().min(1),meaning:z.string().min(1),review:z.literal('perlu-ditinjau'),lessonId:z.string(),source:z.object({title:z.string().min(1),url:z.url().refine(u=>u.startsWith('https://'))}),audio:z.object({path:z.string().regex(/^\/content\/audio\/[a-z0-9-]+\.mp3$/),reciter:z.string().min(1),sourceUrl:z.url().refine(u=>u.startsWith('https://'))}).nullable()})
export const readings: Reading[] = z.array(readingSchema).parse(readingsData)
if(new Set(readings.map(r=>r.id)).size!==readings.length)throw new Error('ID bacaan duplikat')
for(const reading of readings){
 if(!lessons.some(l=>l.id===reading.lessonId && l.readingIds.includes(reading.id)))throw new Error('Bacaan tidak terhubung dengan pelajaran')
}
for(const lesson of lessons)if(lesson.readingIds.some(id=>!readings.some(r=>r.id===id)))throw new Error('Rujukan bacaan tidak ditemukan')
export const terms = Array.from(new Map(lessons.flatMap(l => l.terms).map(t => [t.id, t])).values())
