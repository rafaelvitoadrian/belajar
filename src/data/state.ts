import { z } from 'zod'
import { isCalendarDate } from '../lib/dates'
const day = z.string().refine(isCalendarDate,'Tanggal tidak valid')
const timestamp = z.iso.datetime()
export const stateSchema = z.object({
  progress: z.record(z.string(), z.object({readAt:timestamp.nullable(),quizAt:timestamp.nullable(),attempts:z.number().int().min(0).max(100000),bestScore:z.number().min(0).max(100)}).strict()),
  days: z.record(day,z.object({seconds:z.number().min(0).max(86400),goals:z.array(z.enum(['read','quiz','review'])).max(3),prayers:z.array(z.enum(['Subuh','Zuhur','Asar','Magrib','Isya'])).max(5)}).strict()),
  reviews: z.record(z.string(),z.object({level:z.number().int().min(0).max(5),due:day,lastReviewed:day}).strict()),
  wrongQuestions: z.array(z.string()).max(1000),
  notes: z.record(z.string(),z.string().max(20000)),
  questions: z.array(z.object({id:z.string().min(1),text:z.string().min(1).max(2000),answered:z.boolean(),answer:z.string().max(10000),createdAt:timestamp,lessonId:z.string().nullable()}).strict()).max(1000),
  favorites: z.array(z.string()).max(1000),
  settings: z.object({name:z.string().max(60),dailyMinutes:z.number().int().min(1).max(60),prayerEnabled:z.boolean()}).strict(),
  lastLesson: z.string().nullable()
}).strict()
export type LearningState = z.infer<typeof stateSchema>
export const emptyState = ():LearningState => ({progress:{},days:{},reviews:{},wrongQuestions:[],notes:{},questions:[],favorites:[],settings:{name:'',dailyMinutes:10,prayerEnabled:false},lastLesson:null})
