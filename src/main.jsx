import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/* ── Console Easter Egg 🥚 ──
   Shown when anyone opens DevTools on this portfolio.
   A little treat for fellow developers! ───────────── */
console.log(
    '%c\n ╔══════════════════════════════════════╗\n ║   👋  Hey there, curious dev!        ║\n ║                                      ║\n ║   You found the easter egg 🥚         ║\n ╚══════════════════════════════════════╝\n',
    'color: #a371f7; font-family: monospace; font-size: 13px; font-weight: bold;'
)
console.log(
    '%c  Built with React 18 · Vite · Framer Motion',
    'color: #58a6ff; font-family: monospace; font-size: 12px;'
)
console.log(
    '%c  🚀 Press  Ctrl + `  to open the Terminal interface!',
    'color: #3fb950; font-family: monospace; font-size: 12px; font-weight: 600;'
)
console.log(
    '%c  📬 Want to collaborate? Check the Contact section ↗',
    'color: #6e7681; font-family: monospace; font-size: 11px;'
)
console.log(
    '%c  💼 Open to full-time / freelance opportunities!',
    'color: #e3b341; font-family: monospace; font-size: 11px;'
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
