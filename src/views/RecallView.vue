<script setup lang="ts">
import { computed, ref } from 'vue'
import { lessons } from '../data/content'
import { useLearning } from '../stores/learning'

const store = useLearning()
const cards = lessons.flatMap(lesson => lesson.terms.map(term => ({
  term, source: lesson.sumber.find(source => term.sourceIds.includes(source.id))!
})))
const queue = ref([...cards])
const revealed = ref(false)
const card = computed(() => queue.value[0])
function respond(remembered: boolean) {
  const current = queue.value.shift()
  if (current && !remembered) queue.value.push(current)
  revealed.value = false
}
function restart() {
  queue.value = [...cards].sort((a,b) =>
    Number(store.state.favorites.includes(b.term.id)) - Number(store.state.favorites.includes(a.term.id)))
  revealed.value = false
}
restart()
</script>
<template>
  <div class="page-heading"><div><h1>Latihan ingatan</h1><p>Sebutkan arti istilah sebelum membuka jawabannya. Kartu favorit muncul lebih dahulu.</p></div></div>
  <section class="card" aria-live="polite">
    <template v-if="card">
      <p>{{ queue.length }} kartu tersisa</p>
      <h2>{{ card.term.transliteration }}</h2>
      <p class="arabic" lang="ar" dir="rtl">{{ card.term.arabic }}</p>
      <span class="badge review">Perlu ditinjau guru</span>
      <div v-if="revealed">
        <p class="callout">{{ card.term.meaning }}</p>
        <a :href="card.source.url" target="_blank" rel="noopener noreferrer">{{ card.source.title }}</a>
        <div class="button-row">
          <button class="button primary" @click="respond(true)">Saya ingat</button>
          <button class="button secondary" @click="respond(false)">Ulangi di akhir sesi</button>
        </div>
      </div>
      <div v-else class="button-row"><button class="button primary" @click="revealed=true">Lihat arti</button></div>
    </template>
    <template v-else><h2>Semua kartu sudah diingat</h2><button class="button secondary mt-4" @click="restart">Mulai sesi baru</button></template>
  </section>
</template>
