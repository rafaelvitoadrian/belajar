import { defineStore } from 'pinia'
import { ref } from 'vue'
export type Page = 'home' | 'path' | 'quiz' | 'readings' | 'glossary' | 'notes' | 'settings' | 'lesson'
const pages: Page[] = ['home','path','quiz','readings','glossary','notes','settings','lesson']
export const useNavigation = defineStore('navigation', () => {
  const page = ref<Page>('home')
  const lessonId = ref('syahadat')
  function fromHash() {
    const [next, id] = location.hash.slice(1).split('/')
    page.value = pages.includes(next as Page) ? next as Page : 'home'
    lessonId.value = id || 'syahadat'
  }
  fromHash()
  window.addEventListener('hashchange', fromHash)
  function go(next: Page, id?: string) {
    page.value = next
    if (id) lessonId.value = id
    location.hash = next === 'lesson' ? `lesson/${lessonId.value}` : next
    window.scrollTo({top:0, behavior:'instant'})
    requestAnimationFrame(() => document.getElementById('utama')?.focus())
  }
  return { page, lessonId, go }
})
