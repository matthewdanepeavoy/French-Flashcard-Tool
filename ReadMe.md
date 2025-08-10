# Getting Vite certs set up with Laravel Herd

brew install mkcert
mkcert -install
mkcert flashcard-learning.test

# vite config
import fs from 'fs';

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

# restart vite
npm run dev
