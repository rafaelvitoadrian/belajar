import { addDays, dateKey } from './dates'
export type ReviewState = { level:number; due:string; lastReviewed:string }
export const intervals = [1,3,7,14,30] as const
/** Self-reported recall, not a judgment of religious correctness. */
export function scheduleReview(previous:ReviewState|undefined,remembered:boolean,today=dateKey()):ReviewState {
  if (remembered && previous?.lastReviewed===today) return {...previous}
  const level = remembered ? Math.min(5,Math.max(0,previous?.level||0)+1) : 0
  return {level,due:addDays(today,level ? intervals[level-1]! : 1),lastReviewed:today}
}
export function isDue(review:ReviewState|undefined,today=dateKey()):boolean { return Boolean(review && review.due<=today) }
