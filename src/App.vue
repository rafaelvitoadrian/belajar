<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useLearning } from './stores/learning'
import { useStudyTimer } from './lib/studyTimer'
import { useNavigation } from './stores/navigation'
import type { Page } from './stores/navigation'
import AppIcon from './components/AppIcon.vue'
import DashboardView from './views/DashboardView.vue'
import StageList from './components/StageList.vue'
import GlossaryView from './views/GlossaryView.vue'
import NotesView from './views/NotesView.vue'
import SettingsView from './views/SettingsView.vue'
import { needRefresh, offlineReady, updateApp } from './lib/pwa'
import QuizView from './views/QuizView.vue'
import ReadingsView from './views/ReadingsView.vue'
import LessonView from './views/LessonView.vue'
const store = useLearning()
useStudyTimer()
let dayTimer:ReturnType<typeof setInterval>
onMounted(()=>{void store.init();dayTimer=setInterval(store.refreshDay,30000)})
onUnmounted(()=>clearInterval(dayTimer))
async function refreshApp(){await store.persist();if(!store.error)await updateApp(true)}
function focusMain(){document.getElementById('utama')?.focus()}
function closeMenu(){menu.value=false;document.getElementById('menu-toggle')?.focus()}
const menu = ref(false)
const mobileQuery=window.matchMedia('(max-width:680px)')
const isMobile=ref(mobileQuery.matches)
function resizeMenu(){isMobile.value=mobileQuery.matches;menu.value=false}
mobileQuery.addEventListener('change',resizeMenu)
onUnmounted(()=>mobileQuery.removeEventListener('change',resizeMenu))
async function toggleMenu(){menu.value=!menu.value;if(menu.value){await nextTick();document.querySelector<HTMLButtonElement>('#navigasi button')?.focus()}}
function trapMenu(event:KeyboardEvent){
 if(!isMobile.value || !menu.value)return
 const buttons=Array.from(document.querySelectorAll<HTMLElement>('#navigasi button, #navigasi a[href]'))
 const first=buttons[0],last=buttons.at(-1)
 if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus()}
 if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus()}
}
const nav = useNavigation()
const items: {id:Page;label:string;icon:string}[] = [{id:'home',label:'Beranda',icon:'home'},{id:'path',label:'Jalur belajar',icon:'path'},{id:'quiz',label:'Latihan dan kuis',icon:'quiz'},{id:'readings',label:'Bacaan dan audio',icon:'book'},{id:'glossary',label:'Kamus istilah',icon:'dictionary'},{id:'notes',label:'Catatan dan pertanyaan',icon:'notes'}]
watch(()=>nav.page,()=>{menu.value=false})
</script>
<template><a href="#utama" class="skip-link" @click.prevent="focusMain">Lewati ke konten</a><header class="topbar"><div class="brand"><button id="menu-toggle" class="icon-button mobile-menu" :aria-expanded="menu" aria-controls="navigasi" :aria-label="menu?'Tutup navigasi':'Buka navigasi'" @click="toggleMenu"><AppIcon :name="menu?'close':'menu'"/></button><span class="brand-symbol"><AppIcon name="book" :size="22"/></span><div><strong>Belajar Islam</strong><span class="brand-tagline">SELANGKAH SETIAP HARI</span></div></div><span class="local-badge"><span class="status-dot"></span>{{offlineReady?'Siap offline':'Ruang belajar pribadi'}}</span></header><div class="app-shell"><button v-if="menu" class="drawer-backdrop" aria-label="Tutup navigasi" @click="closeMenu"></button><aside id="navigasi" class="sidebar" :class="{open:menu}" :inert="store.importing || isMobile && !menu" :role="isMobile?'dialog':undefined" :aria-modal="isMobile && menu?true:undefined" aria-label="Ruang belajarmu" @keydown.esc="closeMenu" @keydown.tab="trapMenu"><button v-if="isMobile" class="icon-button drawer-close" aria-label="Tutup navigasi" @click="closeMenu"><AppIcon name="close"/></button><p class="nav-caption">RUANG BELAJARMU</p><nav aria-label="Navigasi utama"><button v-for="item in items" :key="item.id" :class="['nav-item',{active:nav.page===item.id || (nav.page==='lesson'&&item.id==='path')}]" :aria-current="nav.page===item.id?'page':undefined" @click="nav.go(item.id)"><AppIcon :name="item.icon"/><span>{{item.label}}</span></button></nav><div class="sidebar-bottom"><div class="gentle-note"><AppIcon name="leaf"/><strong>Pelan-pelan, tak apa.</strong><p>Setiap langkah kecil adalah bagian dari perjalananmu.</p></div><button class="nav-item" :class="{active:nav.page==='settings'}" @click="nav.go('settings')"><AppIcon name="settings"/>Pengaturan</button><span class="device-note"><AppIcon name="shield" :size="14"/>{{store.error?'Penyimpanan bermasalah':store.saving?'Sedang menyimpan…':'Tersimpan di perangkatmu'}}</span></div></aside><main id="utama" class="main-area" tabindex="-1" :inert="store.importing || isMobile && menu"><div v-if="needRefresh" class="update-banner" role="status"><span>Versi baru tersedia. Catatanmu tetap tersimpan.</span><button class="button secondary" @click="refreshApp">Perbarui aplikasi</button></div><div v-if="store.error" class="error-message" role="alert">{{store.error}}</div><p v-if="!store.ready" role="status">Menyiapkan ruang belajarmu…</p><DashboardView v-else-if="nav.page==='home'"/><template v-else-if="nav.page==='path'"><div class="page-heading"><div><p class="eyebrow">SATU DEMI SATU</p><h1>Jalur belajarmu</h1><p>Ikuti urutannya, atau lompati ke pelajaran yang ingin kamu kenali.</p></div></div><div class="callout content-notice"><AppIcon name="info" :size="18"/><p>Dua pelajaran contoh tersedia. Materi lain akan diisi bertahap setelah ditinjau. Progres tahap mencakup seluruh rencana pelajaran.</p></div><StageList expanded :completed="store.completed"/></template><LessonView v-else-if="nav.page==='lesson'" :key="nav.lessonId"/><QuizView v-else-if="nav.page==='quiz'"/><ReadingsView v-else-if="nav.page==='readings'"/><GlossaryView v-else-if="nav.page==='glossary'"/><NotesView v-else-if="nav.page==='notes'"/><SettingsView v-else-if="nav.page==='settings'"/><section v-else class="card empty-state"><AppIcon name="leaf" :size="30"/><h1>{{items.find(i=>i.id===nav.page)?.label || 'Pengaturan'}}</h1><p>Ruang ini sedang disiapkan.</p></section><footer>Aplikasi ini pelengkap belajar dengan guru dan tidak mengeluarkan fatwa.<br/><span>Belajar perlahan, bertanya saat perlu.</span></footer></main></div></template>
