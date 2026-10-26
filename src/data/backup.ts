import { z } from 'zod'
import { stateSchema, type LearningState } from './state'
import { lessons, readings, terms } from './content'
const backupSchema=z.object({format:z.literal('belajar-islam'),version:z.literal(1),exportedAt:z.iso.datetime(),data:stateSchema}).strict()
export function createBackup(data:LearningState) { return {format:'belajar-islam' as const,version:1 as const,exportedAt:new Date().toISOString(),data:stateSchema.parse(data)} }
export function parseBackup(text:string):LearningState {
  if (new TextEncoder().encode(text).byteLength>5*1024*1024) throw new Error('Berkas melebihi batas 5 MB.')
  let raw:unknown
  try{raw=JSON.parse(text)}catch{throw new Error('Berkas bukan JSON yang valid.')}
  const result=backupSchema.safeParse(raw)
  if(!result.success) throw new Error('Format atau versi cadangan tidak cocok. Gunakan berkas ekspor Belajar Islam versi 1.')
  const state=result.data.data
  const lessonIds=new Set(lessons.map(l=>l.id)),readingIds=new Set(readings.map(r=>r.id)),termIds=new Set(terms.map(t=>t.id)),questionIds=new Set(lessons.flatMap(l=>l.quiz.map(q=>q.id)))
  if(Object.keys(state.progress).some(id=>!lessonIds.has(id)) || Object.keys(state.notes).some(id=>!lessonIds.has(id)) || state.lastLesson && !lessonIds.has(state.lastLesson) || state.questions.some(q=>q.lessonId && !lessonIds.has(q.lessonId)) || Object.keys(state.reviews).some(id=>!readingIds.has(id)) || state.favorites.some(id=>!termIds.has(id)) || state.wrongQuestions.some(id=>!questionIds.has(id))) throw new Error('Cadangan merujuk ke materi yang belum tersedia pada versi ini.')
  if(new Set(state.questions.map(q=>q.id)).size!==state.questions.length) throw new Error('Cadangan berisi ID pertanyaan duplikat.')
  if(new Set(state.wrongQuestions).size!==state.wrongQuestions.length || new Set(state.favorites).size!==state.favorites.length || Object.values(state.days).some(d=>new Set(d.goals).size!==d.goals.length || new Set(d.prayers).size!==d.prayers.length)) throw new Error('Cadangan berisi data duplikat.')
  return state
}
