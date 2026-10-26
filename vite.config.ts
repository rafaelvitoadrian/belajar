import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [vue(), tailwindcss(), VitePWA({
  registerType:'prompt',
  includeAssets:['icon.svg','icon-192.png','icon-512.png'],
  manifest:{id:'/',name:'Belajar Islam — Selangkah setiap hari',short_name:'Belajar Islam',description:'Belajar Islam dari dasar, dengan progres pribadi di perangkatmu.',lang:'id',start_url:'/',scope:'/',display:'standalone',theme_color:'#1F4D3F',background_color:'#F6F4EE',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},
  workbox:{globPatterns:['**/*.{js,css,html,svg,png,woff2,woff,mp3,json}'],maximumFileSizeToCacheInBytes:3*1024*1024,navigateFallback:'/index.html',cleanupOutdatedCaches:true}
}), {
  name: 'local-content-audio',
  configureServer(server) {
    server.middlewares.use((req,res,next)=>{
      if (!req.url?.startsWith('/content/audio/')) return next()
      const name=req.url.split('?')[0]!.slice('/content/audio/'.length)
      if(!/^[a-z0-9-]+\.mp3$/.test(name)) return next()
      try {res.setHeader('Content-Type','audio/mpeg');res.end(readFileSync(resolve('content/audio',name)))} catch {res.statusCode=404;res.end()}
    })
  },
  generateBundle(){for(const name of readdirSync('content/audio').filter(n=>n.endsWith('.mp3'))) this.emitFile({type:'asset',fileName:`content/audio/${name}`,source:readFileSync(resolve('content/audio',name))})}
}], test: { include: ['tests/**/*.test.ts'], maxWorkers: 2 } })
