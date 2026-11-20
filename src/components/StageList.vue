<script setup lang="ts">
import { ref, watch } from 'vue'
import { stages, lessons, type Stage } from '../data/content'
import { useNavigation } from '../stores/navigation'
import AppIcon from './AppIcon.vue'
withDefaults(defineProps<{ expanded?: boolean; completed?: string[] }>(), { expanded: false, completed: () => [] })
const nav = useNavigation()
const open = ref<number[]>([nav.stageId])
watch(() => nav.stageId, id => {open.value = [id]})
function lessonFor(stage:Stage,index:number) {return lessons.find(l=>l.id===stage.lessonIds[index])}
function toggle(id:number) { open.value = open.value.includes(id) ? open.value.filter(x => x!==id) : [...open.value,id] }
function inStage(id:number) { return lessons.filter(l=>l.stageId===id) }
</script>
<template><section class="card learning-card"><div class="section-header"><h2>Jalur belajar</h2><span class="muted text-sm">6 tahap, dari nol</span></div><div v-for="stage in stages" :key="stage.id" class="stage-group"><button class="stage-row stage-button" :aria-expanded="expanded && open.includes(stage.id)" @click="expanded ? toggle(stage.id) : nav.go('path', String(stage.id))"><span class="stage-number" :class="{current:stage.id===1}">{{stage.id}}</span><div class="stage-copy"><h3>{{stage.title}}</h3><p>{{stage.description}}</p><div class="progress-track" role="progressbar" :aria-label="`Progres ${stage.title}`" :aria-valuenow="Math.round(inStage(stage.id).filter(l=>completed.includes(l.id)).length / stage.topics.length*100)" aria-valuemin="0" aria-valuemax="100"><span :style="{width:(inStage(stage.id).filter(l=>completed.includes(l.id)).length / stage.topics.length*100)+'%'}"></span></div></div><span class="stage-percent">{{inStage(stage.id).some(l=>completed.includes(l.id)) ? `${inStage(stage.id).filter(l=>completed.includes(l.id)).length}/${stage.topics.length} selesai` : 'Belum mulai'}}</span><AppIcon name="chevron" :size="15"/></button><div v-if="expanded && open.includes(stage.id)" class="lesson-list"><div v-for="(topic,i) in stage.topics" :key="topic" class="lesson-list-item"><div><strong>{{topic}}</strong><p class="muted text-sm">{{lessonFor(stage,i) ? `${lessonFor(stage,i)!.minutes} menit · ${completed.includes(lessonFor(stage,i)!.id) ? 'Selesai' : 'Perlu ditinjau guru'}` : 'Materi disiapkan'}}</p></div><button v-if="lessonFor(stage,i)" class="button secondary" @click="nav.go('lesson',lessonFor(stage,i)!.id)">{{completed.includes(lessonFor(stage,i)!.id) ? 'Baca lagi' : lessons.findIndex(l=>l.id===lessonFor(stage,i)!.id)===0 || completed.includes(lessons[lessons.findIndex(l=>l.id===lessonFor(stage,i)!.id)-1]?.id || '') ? 'Mulai' : 'Lompati urutan'}}<AppIcon name="arrow" :size="14"/></button><span v-else class="badge neutral">Segera hadir</span></div></div></div></section></template>
