<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useLearning } from '../stores/learning'
const props=defineProps<{lessonId:string}>()
const store=useLearning(),pending=ref(false)
let timer:ReturnType<typeof setTimeout>|undefined
function update(event:Event){store.state.notes[props.lessonId]=(event.target as HTMLTextAreaElement).value;pending.value=true;clearTimeout(timer);timer=setTimeout(save,500)}
async function save(){clearTimeout(timer);await store.persist();pending.value=false}
onUnmounted(()=>{clearTimeout(timer);void store.persist()})
</script>
<template><section class="lesson-note-section"><label :for="`note-${lessonId}`" class="field-label">Catatan pribadimu</label><p class="muted text-sm note-help">Tuliskan yang kamu pahami atau ingin kamu ingat dari pelajaran ini.</p><textarea :id="`note-${lessonId}`" class="form-input note-textarea" :value="store.state.notes[lessonId]||''" rows="6" maxlength="20000" placeholder="Hari ini saya belajar…" @input="update" @blur="save"></textarea><p class="small-note" role="status">{{store.error?'Catatan belum tersimpan.':pending?'Sedang menyimpan…':'Catatan tersimpan di perangkat ini.'}}</p></section></template>
