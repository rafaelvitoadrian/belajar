<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
const paths: Record<string, string> = {
 home:'m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
 path:'M6 3v5m0 8v5m12-18v5M6 8a3 3 0 1 1 0 6h12a3 3 0 0 0 0-6H6m12 8v5',
 quiz:'m9 11 2 2 4-4M9 3h6v3H9zM7 4H5v17h14V4h-2',
 book:'M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15',
 dictionary:'M4 3h14a2 2 0 0 1 2 2v16H5a2 2 0 0 1 0-4h15M4 3v14m4-9h8m-8 4h5',
 notes:'M13 3H5v18h14v-9m-9 3 1-4L19 3l3 3-8 8-4 1Z',
 settings:'m9 3-1 3-3 1-2 3 2 3-1 3 3 2 3-1 3 2 3-2 3-1v-4l2-3-2-3-3-1-1-3Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
 arrow:'M4 12h16m-6-6 6 6-6 6', chevron:'m9 5 7 7-7 7', check:'m5 12 4 4L19 6',
 play:'m9 5 11 7-11 7Z', pause:'M8 5v14M16 5v14', plus:'M12 5v14M5 12h14',
 leaf:'M20 3C9 1 2 8 5 15c7 6 16-1 15-12ZM4 21 16 9',
 clock:'M12 8v5l3 2m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
 shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6',
 star:'m12 3 3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1Z',
 search:'m16 16 5 5m-3-11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
 menu:'M4 6h16M4 12h16M4 18h16', close:'m6 6 12 12M6 18 18 6',
 download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5', upload:'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5',
 info:'M12 11v6m0-10v.1m9 4.9a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
 sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1m-3 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
}
</script>
<template><svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name] || paths.book"/></svg></template>
