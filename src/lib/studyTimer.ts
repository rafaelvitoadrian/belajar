import { onMounted, onUnmounted } from 'vue'
import { useLearning } from '../stores/learning'
import { useNavigation } from '../stores/navigation'
export function useStudyTimer() {
  const store=useLearning(), nav=useNavigation()
  let previous=Date.now(),lastInteraction=Date.now(),unsaved=0,timer:ReturnType<typeof setInterval>
  const interact=()=>{lastInteraction=Date.now()}
  const flush=()=>{void store.persist()}
  const events=['pointerdown','keydown','scroll','touchstart'] as const
  onMounted(()=>{
    events.forEach(e=>window.addEventListener(e,interact,{passive:true}))
    window.addEventListener('pagehide',flush)
    document.addEventListener('visibilitychange',flush)
    timer=setInterval(()=>{
      const now=Date.now(),elapsed=Math.min((now-previous)/1000,5); previous=now
      if (store.ready && !document.hidden && ['lesson','quiz','readings'].includes(nav.page) && now-lastInteraction<120000) {
        store.tick(elapsed);unsaved+=elapsed
        if(unsaved>=10){unsaved=0;flush()}
      }
    },1000)
  })
  onUnmounted(()=>{clearInterval(timer);events.forEach(e=>window.removeEventListener(e,interact));window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',flush);flush()})
}
