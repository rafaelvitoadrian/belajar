import { ref } from 'vue'
import { registerSW } from 'virtual:pwa-register'
interface InstallPrompt extends Event {prompt():Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>}
let promptEvent:InstallPrompt|null=null
export const canInstall=ref(false),offlineReady=ref(false),needRefresh=ref(false)
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event as InstallPrompt;canInstall.value=true})
window.addEventListener('appinstalled',()=>{canInstall.value=false;promptEvent=null})
export async function installApp(){if(!promptEvent)return;await promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;canInstall.value=false}
export const updateApp=registerSW({immediate:true,onRegisteredSW(){void navigator.serviceWorker.ready.then(()=>{offlineReady.value=true})},onOfflineReady(){offlineReady.value=true},onNeedRefresh(){needRefresh.value=true}})
