<script setup lang="ts">
import { useLearning } from '../stores/learning'
const store=useLearning()
const prayers=['Subuh','Zuhur','Asar','Magrib','Isya'] as const
</script>
<template><section v-if="store.state.settings.prayerEnabled" class="card"><p class="eyebrow">CATATAN SHALAT HARI INI</p><label v-for="prayer in prayers" :key="prayer" class="check-row"><input type="checkbox" :checked="store.today.prayers.includes(prayer)" @change="store.togglePrayer(prayer)"/>{{prayer}}</label><p class="small-note">Catatan untuk diri sendiri, tanpa skor dan tanpa penilaian.</p></section></template>
