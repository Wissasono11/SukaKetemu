import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// HTTPS lokal dibutuhkan agar kamera (scan QR) bisa dipakai dari HP lewat IP jaringan.
// Sertifikat dibuat sendiri per laptop (mis. dengan mkcert) dan TIDAK di-commit (*.pem di .gitignore).
// Jika file sertifikat tidak ada (mis. di CI), server dev berjalan tanpa HTTPS dan build tetap aman.
const keyPath = './192.168.0.107+1-key.pem'
const certPath = './192.168.0.107+1.pem'
const hasLocalCert = fs.existsSync(keyPath) && fs.existsSync(certPath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    ...(hasLocalCert
      ? { https: { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } }
      : {}),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
