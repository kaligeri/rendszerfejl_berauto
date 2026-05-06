import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5239', // A backend HTTPS címe
                changeOrigin: true,
                secure: false,
            }
        }
    }
})