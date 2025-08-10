import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        host: 'flashcard-learning.test',
        port: 5173,
        https: {
            key: fs.readFileSync('./flashcard-learning.test-key.pem'),
            cert: fs.readFileSync('./flashcard-learning.test.pem'),
        },
        hmr: {
            host: 'flashcard-learning.test',
            protocol: 'wss',
        },
    },
});
