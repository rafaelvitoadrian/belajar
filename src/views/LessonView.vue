<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLearning } from '../stores/learning'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { lessons, readings } from '../data/content'
import { useNavigation } from '../stores/navigation'
import AppIcon from '../components/AppIcon.vue'
const store=useLearning()
const nav = useNavigation()
onMounted(()=>{if(lessons.some(l=>l.id===nav.lessonId))store.visit(nav.lessonId)})
const lesson = computed(()=>lessons.find(l=>l.id===nav.lessonId))
const html = computed(()=> DOMPurify.sanitize(marked.parse(lesson.value?.body || '', {async:false})))
</script>
<template><div v-if="lesson" class="reading-layout"><button class="button ghost" @click="nav.go('path')">← Kembali ke jalur belajar</button><article class="card lesson-article"><span class="badge review">Perlu ditinjau guru</span><h1>{{lesson.title}}</h1><p class="muted">{{lesson.minutes}} menit · Tahap {{lesson.stageId}} dari 6</p><div class="prose" v-html="html"></div><div v-for="r in readings.filter(r=>lesson!.readingIds.includes(r.id))" :key="r.id" class="callout"><p class="arabic" dir="rtl" lang="ar">{{r.arabic}}</p><strong>{{r.transliteration}}</strong><p>{{r.meaning}}</p><p class="small-note">Teks Arab dan transliterasi perlu ditinjau guru.</p></div><h2>Istilah penting</h2><dl class="term-list"><div v-for="term in lesson.terms" :key="term.id"><dt>{{term.transliteration}}</dt><dd>{{term.meaning}}</dd></div></dl><div v-if="lesson.differences" class="callout"><h3>Ruang untuk bertanya</h3><p>{{lesson.differences}}</p></div><section class="sources"><h2>Sumber pelajaran</h2><ol><li v-for="source in lesson.sumber" :key="source.id"><a :href="source.url" target="_blank" rel="noopener noreferrer">{{source.title}} ↗</a><p v-if="source.narrator">{{source.narrator}}</p><p class="small-note">{{source.note}}</p></li></ol></section><div class="button-row"><button class="button secondary" @click="store.markRead(lesson.id)"><AppIcon name="check" :size="16"/>{{store.state.progress[lesson.id]?.readAt?'Sudah dibaca':'Saya sudah membaca'}}</button><button class="button primary" @click="nav.go('quiz')">Ke latihan pemahaman<AppIcon name="arrow" :size="16"/></button></div><p class="small-note">Pelajaran selesai setelah kamu menandainya sudah dibaca dan menyelesaikan kuis.</p></article></div><section v-else class="card empty-state"><h1>Pelajaran belum tersedia</h1><p>Silakan pilih pelajaran yang tersedia di jalur belajar.</p><button class="button primary" @click="nav.go('path')">Lihat jalur belajar</button></section></template>
