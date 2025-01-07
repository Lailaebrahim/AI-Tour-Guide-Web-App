import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  assetsInclude: ['**/*.wav', '**/*.mp3', '**/*.ogg', '**/*.m4a'],
})
