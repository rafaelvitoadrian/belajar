<script setup lang="ts">
import { computed, ref } from 'vue'
import { readings } from '../data/content'
import { useLearning } from '../stores/learning'
import { isDue } from '../lib/spacedRepetition'
import ReadingCard from '../components/ReadingCard.vue'
const store=useLearning(),onlyDue=ref(false)
const dueCount=computed(()=>readings.filter(r=>isDue(store.state.reviews[r.id],store.todayKey)).length)
const shown=computed(()=>onlyDue.value?readings.filter(r=>isDue(store.state.reviews[r.id],store.todayKey)):readings)
</script>
<template><div class="page-heading"><div><p class="eyebrow">BACA, DENGARKAN, ULANGI</p><h1>Bacaan dan audio</h1><p>Latih perlahan. Ketepatan bacaan dipelajari bersama guru.</p></div></div><div class="filter-row"><button class="filter-chip" :class="{selected:!onlyDue}" :aria-pressed="!onlyDue" @click="onlyDue=false">Semua bacaan · {{readings.length}}</button><button class="filter-chip" :class="{selected:onlyDue}" :aria-pressed="onlyDue" @click="onlyDue=true">Siap diulang · {{dueCount}}</button></div><div v-if="shown.length" class="reading-cards"><ReadingCard v-for="reading in shown" :key="reading.id" :reading="reading"/></div><section v-else class="card empty-state"><h2>Belum ada bacaan yang perlu diulang</h2><p class="muted">Tandai bacaan yang sudah kamu hafal. Pengulangan dimulai esok hari.</p><button class="button secondary" @click="onlyDue=false">Lihat semua bacaan</button></section><div class="callout"><strong>Ritme yang ringan</strong><p>Pengulangan berjarak 1, 3, 7, 14, lalu 30 hari. Jika belum lancar, pilih “Ulangi besok”. Tidak ada nilai yang dikurangi.</p></div></template>
