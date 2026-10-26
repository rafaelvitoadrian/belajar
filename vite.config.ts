import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [vue(), tailwindcss(), {
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
