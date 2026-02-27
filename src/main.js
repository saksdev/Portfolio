/**
 * Portfolio OS — Entry point + Boot sequence
 */
import './style.css'
import { initMenuBar, initDesktop, initDock, initSpotlight, initContextMenu, initNotifications, initKeyboardShortcuts, showNotification, openWindow } from './os.js'
import { APP_REGISTRY } from './apps.js'
import { PERSONAL, CORE, HERO_STATS } from './data/data.js'

// ─── Boot Sequence ───────────────────────────────────────
const boot = document.getElementById('boot')
const desktop = document.getElementById('desktop')
const progressBar = document.getElementById('boot-progress')

let progress = 0

const bootInterval = setInterval(() => {
    progress += Math.random() * 12 + 4
    if (progress >= 100) {
        progress = 100
        clearInterval(bootInterval)

        setTimeout(() => {
            boot.classList.add('boot--done')
            desktop.classList.remove('desktop--hidden')

            setTimeout(() => {
                initOS()
            }, 400)
        }, 600)
    }
    progressBar.style.width = progress + '%'
}, 180)

// ─── Initialize OS ───────────────────────────────────────
function initOS() {
    initMenuBar()
    initDesktop(APP_REGISTRY)
    initDock(APP_REGISTRY)
    initSpotlight(APP_REGISTRY)
    initContextMenu(APP_REGISTRY)
    initNotifications()
    initKeyboardShortcuts()

    // Open welcome README window
    setTimeout(() => openWelcome(), 500)

    // Notification after a delay
    setTimeout(() => {
        showNotification(
            'Welcome!',
            `Double-click icons or use the dock below.<br><b>Ctrl+K</b> to search anything.`
        )
    }, 2500)
}

// ─── Welcome/README Window ───────────────────────────────
function openWelcome() {
    const stats = (HERO_STATS || []).map(s => `<span class="welcome-stat"><strong>${s.target}+</strong> ${s.label}</span>`).join('')

    openWindow('welcome', {
        title: 'README.md',
        icon: '📖',
        width: 560,
        height: 480,
        content: `
            <div class="welcome">
                <div class="welcome__hero">
                    <div class="welcome__avatar">${PERSONAL.name.charAt(0)}</div>
                    <div>
                        <h1 class="welcome__name">${PERSONAL.name}</h1>
                        <p class="welcome__tagline">${PERSONAL.tagline}</p>
                    </div>
                </div>

                ${stats ? `<div class="welcome__stats">${stats}</div>` : ''}

                <div class="welcome__section">
                    <h3>&#128075; Welcome to my Portfolio OS</h3>
                    <p>This is an interactive desktop environment built with <b>pure vanilla JavaScript</b> — zero frameworks, zero runtime dependencies.</p>
                </div>

                <div class="welcome__section">
                    <h3>&#128161; How to navigate</h3>
                    <ul>
                        <li><b>Double-click</b> desktop icons to open apps</li>
                        <li><b>Click dock</b> items at the bottom</li>
                        <li><b>Drag</b> windows by their title bar</li>
                        <li><b>Ctrl+K</b> — Spotlight search</li>
                        <li><b>Right-click</b> desktop for context menu</li>
                        <li><b>Esc</b> — Close focused window</li>
                    </ul>
                </div>

                <div class="welcome__section">
                    <h3>&#62;_ Try the Terminal</h3>
                    <p>Open <b>Terminal</b> and type commands like <code>neofetch</code>, <code>skills</code>, <code>sudo hire me</code></p>
                </div>

                <div class="welcome__section welcome__section--links">
                    <a href="mailto:${CORE.email}" class="welcome__btn">&#128231; Email Me</a>
                    <a href="https://github.com/${CORE.github}" target="_blank" class="welcome__btn welcome__btn--outline">&#128025; GitHub</a>
                    <a href="https://linkedin.com/in/${CORE.linkedin}" target="_blank" class="welcome__btn welcome__btn--outline">&#128188; LinkedIn</a>
                </div>
            </div>
        `,
    })
}
