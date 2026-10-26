<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Reading } from '../data/content'
import { useLearning } from '../stores/learning'
import { isDue } from '../lib/spacedRepetition'
import AppIcon from './AppIcon.vue'
const props=withDefaults(defineProps<{ reading:Reading; compact?:boolean }>(),{compact:false})
const store=useLearning(), audio=ref<HTMLAudioElement>(),playing=ref(false),audioError=ref('')
const review=computed(()=>store.state.reviews[props.reading.id])
const due=computed(()=>isDue(review.value,store.todayKey))
async function toggleAudio(){
  if(!audio.value)return
  audioError.value=''
  if(playing.value) {audio.value.pause();return}
  try{await audio.value.play()}catch{audioError.value='Audio belum dapat diputar. Coba lagi setelah file tersimpan untuk offline.'}
}
const dueLabel=computed(()=>review.value?new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${review.value.due}T12:00:00`)):'')
</script>
<template><section class="card reading-preview" :class="{'reading-full':!compact}"><p class="eyebrow">{{compact?'BACAAN HARI INI':reading.title.toLocaleUpperCase('id-ID')}}</p><p class="arabic" lang="ar" dir="rtl">{{reading.arabic}}</p><h3>{{reading.transliteration}}</h3><p class="muted">{{reading.meaning}}</p><div class="reading-meta"><span class="badge review">Perlu ditinjau guru</span><a :href="reading.source.url" class="text-sm" target="_blank" rel="noopener noreferrer">Sumber ↗</a></div><audio v-if="reading.audio" ref="audio" :src="reading.audio.path" preload="none" @play="playing=true" @pause="playing=false" @ended="playing=false" @error="audioError='File audio belum dapat dibuka. Coba muat ulang saat terhubung.'"></audio><div class="button-row"><button v-if="reading.audio" class="button primary" :aria-label="`${playing?'Jeda':'Putar'} audio ${reading.title}`" @click="toggleAudio"><AppIcon :name="playing?'pause':'play'" :size="15"/>{{playing?'Jeda audio':'Putar audio'}}</button><span v-else class="small-note">Audio belum tersedia.</span><button v-if="!review" class="button secondary" @click="store.reviewReading(reading.id,true)"><AppIcon name="check" :size="15"/>Sudah hafal</button></div><p v-if="audioError" class="inline-error" role="alert">{{audioError}}</p><template v-if="review"><p class="review-schedule"><AppIcon name="clock" :size="14"/>{{due?'Siap diulang, saat kamu siap.':`Pengulangan berikut: ${dueLabel}`}}</p><div class="button-row review-actions"><button class="button secondary" :disabled="review.lastReviewed===store.todayKey" @click="store.reviewReading(reading.id,true)">{{review.lastReviewed===store.todayKey?'Latihan tercatat':'Masih ingat'}}</button><button class="button secondary" @click="store.reviewReading(reading.id,false)">Ulangi besok</button></div></template><template v-if="!compact"><p class="small-note">Transliterasi membantu langkah awal. Minta guru memeriksa pelafalanmu; status hafal adalah catatan latihan pribadi.</p><p v-if="reading.audio" class="small-note">Audio: {{reading.audio.reciter}} · <a :href="reading.audio.sourceUrl" target="_blank" rel="noopener noreferrer">Asal rekaman ↗</a></p></template></section></template>
