/**
 * OS Core — Window Manager + Desktop + Dock + Menu Bar
 * Pure vanilla JS, no frameworks.
 */

import {
    SKILLS, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATES,
    SOCIAL_LINKS, CONTACT_ITEMS
} from './data/data.js'

// ─── WINDOW MANAGER ─────────────────────────────────────

let zCounter = 100
let activeWindowId = null
const openWindows = {}
let cascadeOffset = 0

export function openWindow(id, { title, icon, width = 600, height = 480, content, onMount, windowClass = '' }) {
    // If already open, just focus
    if (openWindows[id]) {
        focusWindow(id)
        restoreWindow(id)
        return
    }

    const layer = document.getElementById('windows')
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Calculate center position with cascade
    const left = Math.max(20, (vw - width) / 2 + cascadeOffset)
    const top = Math.max(20, (vh - height) / 2 - 40 + cascadeOffset)
    cascadeOffset = (cascadeOffset + 30) % 120

    const win = document.createElement('div')
    win.className = `window window--opening ${windowClass}`
    win.dataset.id = id
    win.style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:${++zCounter};`

    win.innerHTML = `
        <div class="window__titlebar">
            <div class="window__btns">
                <button class="window__btn window__btn--close" data-action="close"></button>
                <button class="window__btn window__btn--minimize" data-action="minimize"></button>
                <button class="window__btn window__btn--maximize" data-action="maximize"></button>
            </div>
            <span class="window__title">${icon || ''} ${title}</span>
        </div>
        <div class="window__content">${content}</div>
    `

    layer.appendChild(win)

    // Remove opening animation class
    setTimeout(() => win.classList.remove('window--opening'), 300)

    // Track
    openWindows[id] = { el: win, title, icon, minimized: false, maximized: false }
    focusWindow(id)
    updateDockIndicators()
    updateMenuBarApp(title)

    // Event: title bar buttons
    win.querySelector('.window__btns').addEventListener('click', e => {
        const action = e.target.dataset.action
        if (action === 'close') closeWindow(id)
        else if (action === 'minimize') minimizeWindow(id)
        else if (action === 'maximize') toggleMaximize(id)
    })

    // Event: click to focus
    win.addEventListener('mousedown', () => focusWindow(id))

    // Event: drag
    initDrag(win, id)

    // Call onMount for interactive apps
    if (onMount) {
        const contentEl = win.querySelector('.window__content')
        onMount(contentEl, { openWindow, closeWindow })
    }

    // Bounce dock icon
    bounceDockItem(id)
}

export function closeWindow(id) {
    const w = openWindows[id]
    if (!w) return

    w.el.classList.add('window--closing')
    setTimeout(() => {
        w.el.remove()
        delete openWindows[id]
        updateDockIndicators()

        // Focus next window
        const remaining = Object.keys(openWindows)
        if (remaining.length > 0) {
            focusWindow(remaining[remaining.length - 1])
        } else {
            activeWindowId = null
            updateMenuBarApp('Finder')
        }
    }, 200)
}

export function focusWindow(id) {
    const w = openWindows[id]
    if (!w) return

    // Remove focused from all
    Object.values(openWindows).forEach(win => win.el.classList.remove('window--focused'))

    w.el.style.zIndex = ++zCounter
    w.el.classList.add('window--focused')
    activeWindowId = id
    updateMenuBarApp(w.title)
}

function minimizeWindow(id) {
    const w = openWindows[id]
    if (!w) return
    w.minimized = true
    w.el.classList.add('window--minimizing')
    setTimeout(() => {
        w.el.style.display = 'none'
        w.el.classList.remove('window--minimizing')
    }, 300)

    // Focus next
    const remaining = Object.keys(openWindows).filter(k => !openWindows[k].minimized)
    if (remaining.length > 0) focusWindow(remaining[remaining.length - 1])
    else { activeWindowId = null; updateMenuBarApp('Finder') }
}

function restoreWindow(id) {
    const w = openWindows[id]
    if (!w || !w.minimized) return
    w.minimized = false
    w.el.style.display = ''
    w.el.classList.add('window--opening')
    setTimeout(() => w.el.classList.remove('window--opening'), 300)
    focusWindow(id)
}

function toggleMaximize(id) {
    const w = openWindows[id]
    if (!w) return
    w.maximized = !w.maximized
    w.el.classList.toggle('window--maximized', w.maximized)
}

function initDrag(win, id) {
    const titlebar = win.querySelector('.window__titlebar')
    let dragging = false
    let startX, startY, startLeft, startTop

    titlebar.addEventListener('mousedown', e => {
        if (e.target.closest('.window__btn')) return
        if (openWindows[id]?.maximized) return
        dragging = true
        startX = e.clientX
        startY = e.clientY
        const rect = win.getBoundingClientRect()
        startLeft = rect.left
        startTop = rect.top - 28 // account for menubar offset in windows-layer
        win.style.transition = 'none'
        e.preventDefault()
    })

    document.addEventListener('mousemove', e => {
        if (!dragging) return
        win.style.left = (startLeft + e.clientX - startX) + 'px'
        win.style.top = (startTop + e.clientY - startY) + 'px'
    })

    document.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false
            win.style.transition = ''
        }
    })

    // Touch support
    titlebar.addEventListener('touchstart', e => {
        if (e.target.closest('.window__btn')) return
        if (openWindows[id]?.maximized) return
        const touch = e.touches[0]
        dragging = true
        startX = touch.clientX
        startY = touch.clientY
        const rect = win.getBoundingClientRect()
        startLeft = rect.left
        startTop = rect.top - 28
        win.style.transition = 'none'
    }, { passive: true })

    document.addEventListener('touchmove', e => {
        if (!dragging) return
        const touch = e.touches[0]
        win.style.left = (startLeft + touch.clientX - startX) + 'px'
        win.style.top = (startTop + touch.clientY - startY) + 'px'
    }, { passive: true })

    document.addEventListener('touchend', () => {
        if (dragging) {
            dragging = false
            win.style.transition = ''
        }
    })
}

// ─── MENU BAR ────────────────────────────────────────────

export function initMenuBar() {
    const bar = document.getElementById('menubar')
    bar.innerHTML = `
        <div class="menubar__left">
            <span class="menubar__apple">&#9776;</span>
            <span class="menubar__app-name" id="menubar-app">Finder</span>
            <div class="menubar__menus">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Help</span>
            </div>
        </div>
        <div class="menubar__right">
            <span>📶</span>
            <span>🔋</span>
            <span class="menubar__clock" id="menubar-clock"></span>
        </div>
    `
    updateClock()
    setInterval(updateClock, 30000)
}

function updateClock() {
    const el = document.getElementById('menubar-clock')
    if (!el) return
    const now = new Date()
    el.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
        '  ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function updateMenuBarApp(name) {
    const el = document.getElementById('menubar-app')
    if (el) el.textContent = name || 'Finder'
}

// ─── DESKTOP ICONS ───────────────────────────────────────

let selectedIcon = null

export function initDesktop(appRegistry) {
    const container = document.getElementById('desktop-icons')
    container.innerHTML = ''

    Object.values(appRegistry).forEach(app => {
        const btn = document.createElement('button')
        btn.className = 'desktop-icon'
        btn.dataset.app = app.id
        btn.innerHTML = `
            <span class="desktop-icon__img">${app.icon}</span>
            <span class="desktop-icon__label">${app.title}</span>
        `

        // Single click to select
        btn.addEventListener('click', e => {
            e.stopPropagation()
            if (selectedIcon) selectedIcon.classList.remove('desktop-icon--selected')
            btn.classList.add('desktop-icon--selected')
            selectedIcon = btn
        })

        // Double click to open
        btn.addEventListener('dblclick', () => {
            app.open()
        })

        container.appendChild(btn)
    })

    // Click desktop to deselect
    document.getElementById('desktop').addEventListener('click', e => {
        if (e.target.closest('.desktop-icon') || e.target.closest('.window') || e.target.closest('.dock')) return
        if (selectedIcon) {
            selectedIcon.classList.remove('desktop-icon--selected')
            selectedIcon = null
        }
    })
}

// ─── DOCK ────────────────────────────────────────────────

let dockItems = {}

export function initDock(appRegistry) {
    const dock = document.getElementById('dock')
    const container = document.createElement('div')
    container.className = 'dock__items'

    const apps = Object.values(appRegistry)
    apps.forEach((app, i) => {
        const btn = document.createElement('button')
        btn.className = 'dock__item'
        btn.dataset.app = app.id
        btn.innerHTML = `
            <span class="dock__icon">${app.icon}</span>
            <span class="dock__dot"></span>
            <span class="dock__tooltip">${app.title}</span>
        `

        btn.addEventListener('click', () => {
            if (openWindows[app.id]) {
                if (openWindows[app.id].minimized) restoreWindow(app.id)
                else focusWindow(app.id)
            } else {
                app.open()
            }
        })

        dockItems[app.id] = btn
        container.appendChild(btn)

        // Add separator before terminal (last item)
        if (i === apps.length - 2) {
            const sep = document.createElement('div')
            sep.className = 'dock__sep'
            container.appendChild(sep)
        }
    })

    dock.appendChild(container)
}

function updateDockIndicators() {
    Object.entries(dockItems).forEach(([id, btn]) => {
        btn.classList.toggle('dock__item--open', !!openWindows[id])
    })
}

function bounceDockItem(id) {
    const btn = dockItems[id]
    if (!btn) return
    btn.classList.add('dock__item--bounce')
    setTimeout(() => btn.classList.remove('dock__item--bounce'), 500)
}

// ─── SPOTLIGHT SEARCH ────────────────────────────────────

let spotlightOpen = false
let spotlightRegistry = null

export function initSpotlight(appRegistry) {
    spotlightRegistry = appRegistry

    const overlay = document.createElement('div')
    overlay.id = 'spotlight'
    overlay.className = 'spotlight'
    overlay.innerHTML = `
        <div class="spotlight__box">
            <div class="spotlight__input-row">
                <span class="spotlight__icon">&#128269;</span>
                <input class="spotlight__input" id="spotlight-input" type="text" placeholder="Search apps, skills, projects..." autocomplete="off" spellcheck="false" />
                <kbd class="spotlight__kbd">ESC</kbd>
            </div>
            <div class="spotlight__results" id="spotlight-results"></div>
        </div>
    `
    document.body.appendChild(overlay)

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeSpotlight()
    })

    const input = document.getElementById('spotlight-input')
    const results = document.getElementById('spotlight-results')

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase()
        if (!q) { results.innerHTML = renderSpotlightHints(); return }
        const items = searchAll(q)
        if (items.length === 0) {
            results.innerHTML = '<div class="spotlight__empty">No results found</div>'
        } else {
            results.innerHTML = items.map((item, i) =>
                `<button class="spotlight__item${i === 0 ? ' spotlight__item--focused' : ''}" data-action="${item.action}" data-id="${item.id}">
                    <span class="spotlight__item-icon">${item.icon}</span>
                    <div class="spotlight__item-info">
                        <span class="spotlight__item-title">${item.title}</span>
                        <span class="spotlight__item-sub">${item.sub}</span>
                    </div>
                    <span class="spotlight__item-type">${item.type}</span>
                </button>`
            ).join('')
        }
    })

    input.addEventListener('keydown', e => {
        const items = results.querySelectorAll('.spotlight__item')
        const focused = results.querySelector('.spotlight__item--focused')
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            if (!items.length) return
            const arr = [...items]
            let idx = arr.indexOf(focused)
            if (focused) focused.classList.remove('spotlight__item--focused')
            idx = e.key === 'ArrowDown' ? (idx + 1) % arr.length : (idx - 1 + arr.length) % arr.length
            arr[idx].classList.add('spotlight__item--focused')
            arr[idx].scrollIntoView({ block: 'nearest' })
        } else if (e.key === 'Enter') {
            if (focused) focused.click()
        } else if (e.key === 'Escape') {
            closeSpotlight()
        }
    })

    results.addEventListener('click', e => {
        const btn = e.target.closest('.spotlight__item')
        if (!btn) return
        const action = btn.dataset.action
        const id = btn.dataset.id
        if (action === 'open' && spotlightRegistry[id]) {
            spotlightRegistry[id].open()
        }
        closeSpotlight()
    })

    // Show hints initially
    results.innerHTML = renderSpotlightHints()

    // Global shortcut
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault()
            toggleSpotlight()
        }
        if (e.key === 'Escape' && spotlightOpen) {
            closeSpotlight()
        }
    })
}

function renderSpotlightHints() {
    if (!spotlightRegistry) return ''
    return Object.values(spotlightRegistry).map(app =>
        `<button class="spotlight__item" data-action="open" data-id="${app.id}">
            <span class="spotlight__item-icon">${app.icon}</span>
            <div class="spotlight__item-info">
                <span class="spotlight__item-title">${app.title}</span>
                <span class="spotlight__item-sub">Open app</span>
            </div>
            <span class="spotlight__item-type">App</span>
        </button>`
    ).join('')
}

function searchAll(query) {
    const results = []
    if (!spotlightRegistry) return results
    const q = query.toLowerCase()

    // Search apps
    Object.values(spotlightRegistry).forEach(app => {
        if (app.title.toLowerCase().includes(q) || app.id.includes(q)) {
            results.push({ icon: app.icon, title: app.title, sub: 'Open app', type: 'App', action: 'open', id: app.id })
        }
    })

    // Search skills
    Object.entries(SKILLS || {}).forEach(([, items]) => {
        (items || []).forEach(s => {
            if (s.label.toLowerCase().includes(q)) {
                results.push({ icon: '🛠️', title: s.label, sub: 'View in Skills', type: 'Skill', action: 'open', id: 'skills' })
            }
        })
    })

    // Search projects
    ;(PROJECTS || []).forEach(p => {
        if (p.title.toLowerCase().includes(q) || (p.tags || []).some(t => t.toLowerCase().includes(q))) {
            results.push({ icon: p.emoji, title: p.title, sub: (p.tags || []).join(', '), type: 'Project', action: 'open', id: 'projects' })
        }
    })

    // Search experience
    ;(EXPERIENCE || []).forEach(exp => {
        if (exp.role.toLowerCase().includes(q) || exp.company.toLowerCase().includes(q)) {
            results.push({ icon: '💼', title: exp.role, sub: exp.company, type: 'Exp', action: 'open', id: 'experience' })
        }
    })

    // Search education
    ;(EDUCATION || []).forEach(edu => {
        if (edu.degree.toLowerCase().includes(q) || edu.institution.toLowerCase().includes(q)) {
            results.push({ icon: '🎓', title: edu.degree, sub: edu.institution, type: 'Edu', action: 'open', id: 'education' })
        }
    })

    // Search certificates
    ;(CERTIFICATES || []).forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)) {
            results.push({ icon: '📜', title: c.title, sub: c.issuer, type: 'Cert', action: 'open', id: 'certificates' })
        }
    })

    // Search contacts
    ;(CONTACT_ITEMS || []).forEach(c => {
        if (c.label.toLowerCase().includes(q) || (c.sub || '').toLowerCase().includes(q)) {
            results.push({ icon: c.icon, title: c.label, sub: c.sub, type: 'Contact', action: 'open', id: 'contact' })
        }
    })

    // Deduplicate by title+type
    const seen = new Set()
    return results.filter(r => {
        const key = r.title + r.type
        if (seen.has(key)) return false
        seen.add(key)
        return true
    }).slice(0, 8)
}

function toggleSpotlight() {
    spotlightOpen ? closeSpotlight() : openSpotlight()
}

function openSpotlight() {
    const el = document.getElementById('spotlight')
    if (!el) return
    spotlightOpen = true
    el.classList.add('spotlight--open')
    const input = document.getElementById('spotlight-input')
    input.value = ''
    input.focus()
    document.getElementById('spotlight-results').innerHTML = renderSpotlightHints()
}

function closeSpotlight() {
    const el = document.getElementById('spotlight')
    if (!el) return
    spotlightOpen = false
    el.classList.remove('spotlight--open')
}

// ─── CONTEXT MENU ────────────────────────────────────────

export function initContextMenu(appRegistry) {
    const menu = document.createElement('div')
    menu.id = 'context-menu'
    menu.className = 'ctx-menu'
    document.body.appendChild(menu)

    document.getElementById('desktop').addEventListener('contextmenu', e => {
        if (e.target.closest('.window') || e.target.closest('.dock') || e.target.closest('.menubar')) return
        e.preventDefault()
        const x = Math.min(e.clientX, window.innerWidth - 200)
        const y = Math.min(e.clientY, window.innerHeight - 250)
        menu.style.left = x + 'px'
        menu.style.top = y + 'px'
        menu.innerHTML = `
            <button class="ctx-menu__item" data-action="about">👤 About Me</button>
            <button class="ctx-menu__item" data-action="terminal">&#62;_ Open Terminal</button>
            <div class="ctx-menu__sep"></div>
            <button class="ctx-menu__item" data-action="spotlight">&#128269; Spotlight Search</button>
            <button class="ctx-menu__item" data-action="shortcuts">&#9000; Keyboard Shortcuts</button>
            <div class="ctx-menu__sep"></div>
            <button class="ctx-menu__item ctx-menu__item--muted" data-action="none">Portfolio OS v2.0</button>
        `
        menu.classList.add('ctx-menu--open')
    })

    menu.addEventListener('click', e => {
        const action = e.target.closest('.ctx-menu__item')?.dataset.action
        menu.classList.remove('ctx-menu--open')
        if (action === 'about' && appRegistry.about) appRegistry.about.open()
        else if (action === 'terminal' && appRegistry.terminal) appRegistry.terminal.open()
        else if (action === 'spotlight') openSpotlight()
        else if (action === 'shortcuts') showShortcutsNotification()
    })

    document.addEventListener('click', e => {
        if (!e.target.closest('#context-menu')) menu.classList.remove('ctx-menu--open')
    })
}

function showShortcutsNotification() {
    showNotification('Keyboard Shortcuts', 'Ctrl+K: Spotlight Search\nEsc: Close window / spotlight')
}

// ─── NOTIFICATIONS ───────────────────────────────────────

let notifContainer = null

export function initNotifications() {
    notifContainer = document.createElement('div')
    notifContainer.className = 'notif-container'
    document.body.appendChild(notifContainer)
}

export function showNotification(title, body, duration = 4000) {
    if (!notifContainer) return
    const el = document.createElement('div')
    el.className = 'notif notif--enter'
    el.innerHTML = `
        <div class="notif__header">
            <span class="notif__icon">&#128276;</span>
            <strong class="notif__title">${title}</strong>
            <button class="notif__close">&times;</button>
        </div>
        <div class="notif__body">${body.replace(/\n/g, '<br>')}</div>
    `
    notifContainer.appendChild(el)
    setTimeout(() => el.classList.remove('notif--enter'), 10)
    el.querySelector('.notif__close').addEventListener('click', () => dismissNotif(el))
    setTimeout(() => dismissNotif(el), duration)
}

function dismissNotif(el) {
    if (!el.parentNode) return
    el.classList.add('notif--exit')
    setTimeout(() => el.remove(), 300)
}

// ─── KEYBOARD SHORTCUTS ──────────────────────────────────

export function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        // Escape to close focused window (only if spotlight is not open)
        if (e.key === 'Escape' && !spotlightOpen && activeWindowId) {
            closeWindow(activeWindowId)
        }
    })
}
