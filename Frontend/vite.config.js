import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   esbuild: {
//     drop: mode === 'production' ? ['console', 'debugger'] : []
//     }
// })

export default defineConfig(({ mode }) => {
  return{
    plugins: [
      react(),
      tailwindcss()
    ],
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : []
    }
  }
})
