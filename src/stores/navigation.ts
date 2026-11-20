import { defineStore } from 'pinia'
import { ref } from 'vue'
export type Page = 'home' | 'path' | 'quiz' | 'readings' | 'glossary' | 'notes' | 'settings' | 'lesson' | 'recall'
const pages: Page[] = ['home','path','quiz','readings','glossary','notes','settings','lesson','recall']
export const useNavigation = defineStore('navigation', () => {
  const page = ref<Page>('home')
  const stageId = ref(1)
  const lessonId = ref('syahadat')
  function fromHash() {
    const [next, id] = location.hash.slice(1).split('/')
    page.value = pages.includes(next as Page) ? next as Page : 'home'
    if(next === 'lesson' && id) lessonId.value = id
    if(next === 'path') stageId.value = /^[1-6]$/.test(id || '') ? Number(id) : 1
  }
  fromHash()
  window.addEventListener('hashchange', fromHash)
  function go(next: Page, id?: string) {
    page.value = next
    if (next === 'lesson' && id) lessonId.value = id
    if (next === 'path') stageId.value = Number(id) || 1
    location.hash = next === 'lesson' ? `lesson/${lessonId.value}` : next === 'path' && id ? `path/${id}` : next
    window.scrollTo({top:0, behavior:'instant'})
    requestAnimationFrame(() => document.getElementById('utama')?.focus())
  }
  return { page, lessonId, stageId, go }
})
