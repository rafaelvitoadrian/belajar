import { addDays, dateKey } from './dates'
export type LessonProgress = { readAt: string | null; quizAt: string | null; attempts: number; bestScore: number }
export function isCompleted(progress?: LessonProgress): boolean { return Boolean(progress?.readAt && progress?.quizAt) }
export function progressPercent(completed:number,total:number):number { return total > 0 ? Math.round(Math.min(Math.max(completed,0),total)/total*100) : 0 }
/** A missed day never removes completed lessons or the best streak. Yesterday also keeps today's streak open. */
export function streakStats(activeDates:string[],today=dateKey()) {
  const days = Array.from(new Set(activeDates.filter(day=>day<=today))).sort()
  let best=0,run=0,previous=''
  for (const day of days) { run = previous && addDays(previous,1)===day ? run+1 : 1; best=Math.max(best,run);previous=day }
  let current=0
  let day=days.includes(today)?today:addDays(today,-1)
  const active = new Set(days)
  while(active.has(day)) {current++;day=addDays(day,-1)}
  return {current,best,totalDays:days.length}
}
