import { defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { readState, writeState } from '../data/database'
import { emptyState, stateSchema, type LearningState } from '../data/state'
import { lessons, stages } from '../data/content'
import { scheduleReview } from '../lib/spacedRepetition'
import { dateKey } from '../lib/dates'
import { isCompleted, progressPercent, streakStats } from '../lib/progress'
export const useLearning = defineStore('learning',()=>{
  const state=ref<LearningState>(emptyState())
  const ready=ref(false)
  const error=ref('')
  const saving=ref(false)
  const todayKey=ref(dateKey())
  let queue:Promise<void> = Promise.resolve()
  async function init() {
    try { const saved = await readState(); if(saved) state.value=stateSchema.parse(saved) }
    catch { error.value='Penyimpanan lokal belum dapat dibaca. Data lama tidak ditimpa. Muat ulang atau periksa izin penyimpanan browser.' }
    finally {ready.value=true}
  }
  function persist() {
    if(!ready.value || error.value) return queue
    const snapshot = structuredClone(toRaw(state.value))
    saving.value=true
    queue=queue.then(()=>writeState(snapshot)).catch(()=>{error.value='Perubahan belum tersimpan. Periksa ruang penyimpanan dan izin browser; ekspor data untuk membuat cadangan.'}).finally(()=>{saving.value=false})
    return queue
  }
  function day() {
    todayKey.value=dateKey()
    return state.value.days[todayKey.value] ??= {seconds:0,goals:[],prayers:[]}
  }
  const today=computed(()=>state.value.days[todayKey.value] || {seconds:0,goals:[],prayers:[]})
  const completed=computed(()=>lessons.filter(l=>isCompleted(state.value.progress[l.id])).map(l=>l.id))
  const totalPlanned = stages.reduce((sum,s)=>sum+s.topics.length,0)
  const percent=computed(()=>progressPercent(completed.value.length,totalPlanned))
  const streak=computed(()=>streakStats(Object.keys(state.value.days).filter(d=>{const v=state.value.days[d]!;return v.seconds>0 || v.goals.length>0}),todayKey.value))
  const nextLesson=computed(()=>lessons.find(l=>l.id===state.value.lastLesson && !completed.value.includes(l.id)) || lessons.find(l=>!completed.value.includes(l.id)) || lessons[0]!)
  function tick(seconds:number) { const d=day();d.seconds=Math.min(86400,d.seconds+seconds) }
  function toggleGoal(goal:'read'|'quiz'|'review') {const d=day(); d.goals=d.goals.includes(goal)?d.goals.filter(x=>x!==goal):[...d.goals,goal];void persist()}
  function fulfill(goal:'read'|'quiz'|'review') {const d=day();if(!d.goals.includes(goal))d.goals.push(goal)}
  function visit(id:string) {state.value.lastLesson=id;void persist()}
  function markRead(id:string) {
    state.value.progress[id] ??= {readAt:null,quizAt:null,attempts:0,bestScore:0}
    state.value.progress[id]!.readAt=new Date().toISOString();fulfill('read');void persist()
  }
  function updateSettings(value:LearningState['settings']) {state.value.settings=value;void persist()}
  function recordAnswer(id:string,correct:boolean) {
    state.value.wrongQuestions=state.value.wrongQuestions.filter(q=>q!==id)
    if(!correct) state.value.wrongQuestions.push(id)
    void persist()
  }
  function finishQuiz(id:string,score:number) {
    state.value.progress[id] ??= {readAt:null,quizAt:null,attempts:0,bestScore:0}
    const progress=state.value.progress[id]!
    progress.quizAt=new Date().toISOString();progress.attempts++;progress.bestScore=Math.max(progress.bestScore,score)
    fulfill('quiz');void persist()
  }
  function reviewReading(id:string,remembered:boolean) {
    state.value.reviews[id]=scheduleReview(state.value.reviews[id],remembered,dateKey())
    fulfill('review');void persist()
  }
  return {recordAnswer,finishQuiz,reviewReading,state,ready,error,saving,todayKey,today,completed,totalPlanned,percent,streak,nextLesson,init,persist,tick,toggleGoal,fulfill,visit,markRead,updateSettings}
})
