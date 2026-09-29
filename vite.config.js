// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/AGRINOVA/',
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AGRINOVA/',
  build: {
    outDir: '.', // Tells Vite to output the build directly to your project root
    emptyOutDir: false, // Prevents Vite from deleting your source files during build
  },
})