/**
 * All app modules — each returns { id, title, icon, width, height, render(), onMount?() }
 * render() returns an HTML string. onMount(el) adds interactivity after DOM insertion.
 */
import { openWindow, showNotification } from './os.js'
import {
    PERSONAL, SKILLS, PROJECTS, PROJECT_FILTERS,
    EXPERIENCE, EDUCATION, CERTIFICATES,
    USERNAMES, PLATFORMS, SOCIAL_LINKS, CONTACT_ITEMS, CORE
} from './data/data.js'
import { fetchGitHub, fetchLeetCode, fetchCodeforces } from './api.js'
import { createTerminal } from './terminal.js'

// Helper: each app gets an open() method for convenience
function makeApp(app) {
    app.open = () => openWindow(app.id, {
        title: app.title,
        icon: app.icon,
        width: app.width,
        height: app.height,
        content: app.render(),
        onMount: app.onMount,
        windowClass: app.windowClass || '',
    })
    return app
}

// ─── ABOUT ───────────────────────────────────────────────
const about = makeApp({
    id: 'about',
    title: 'About Me',
    icon: '👤',
    width: 580,
    height: 520,
    render() {
        const bio = (PERSONAL.bio || []).map(p => `<p class="app-text">${p}</p>`).join('')
        const chips = (PERSONAL.chips || []).map(c => `<span class="app-chip">${c.icon} ${c.text}</span>`).join('')
        const details = [
            EDUCATION[0]?.degree ? `<div class="app-detail"><span class="app-detail__icon">🎓</span> ${EDUCATION[0].degree}</div>` : '',
            `<div class="app-detail"><span class="app-detail__icon">📍</span> ${CORE.location}</div>`,
        ].join('')

        return `
            <div class="app-section">
                <div class="app-label">About</div>
                <div class="app-heading">${PERSONAL.name}</div>
                <div style="font-size:0.82rem;color:var(--text-2);margin-bottom:16px">${PERSONAL.tagline}</div>
            </div>
            <div class="app-section">${bio}</div>
            <div class="app-divider"></div>
            <div class="app-section">${details}</div>
            <div class="app-section" style="margin-top:12px">${chips}</div>
        `
    }
})

// ─── SKILLS ──────────────────────────────────────────────
const skills = makeApp({
    id: 'skills',
    title: 'Skills',
    icon: '🛠️',
    width: 540,
    height: 500,
    render() {
        const groups = Object.entries(SKILLS || {})
            .filter(([, arr]) => arr?.length)
            .map(([cat, items]) => {
                const tags = items.map(s =>
                    `<span class="skills-tag" style="--accent:${s.accent}"><span class="skills-dot" style="background:${s.accent};box-shadow:0 0 6px ${s.accent}"></span>${s.label}</span>`
                ).join('')
                return `<div class="skills-group"><div class="skills-cat">${cat}</div><div class="skills-tags">${tags}</div></div>`
            }).join('')

        return `<div class="app-label">Tech Stack</div>${groups}`
    }
})

// ─── PROJECTS ────────────────────────────────────────────
const projects = makeApp({
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    width: 600,
    height: 540,
    render() {
        const filters = (PROJECT_FILTERS || []).length > 1
            ? `<div class="projects-filters">${PROJECT_FILTERS.map(f =>
                `<button class="projects-filter${f.key === 'all' ? ' projects-filter--active' : ''}" data-filter="${f.key}">${f.label}</button>`
            ).join('')}</div>` : ''

        const cards = (PROJECTS || []).map(p => {
            const tags = (p.tags || []).map(t => `<span class="project-card__tag">${t}</span>`).join('')
            const links = [
                p.liveUrl && p.liveUrl !== '#' ? `<a href="${p.liveUrl}" class="project-card__link" target="_blank">Live</a>` : '',
                p.demoUrl && p.demoUrl !== '#' ? `<a href="${p.demoUrl}" class="project-card__link" target="_blank">Demo</a>` : '',
                p.codeUrl && p.codeUrl !== '#' ? `<a href="${p.codeUrl}" class="project-card__link" target="_blank">Code</a>` : '',
            ].filter(Boolean).join('')

            return `<div class="project-card" data-cat="${p.cat}">
                <span class="project-card__emoji">${p.emoji}</span>
                <div class="project-card__title">${p.title}</div>
                <div class="project-card__desc">${p.desc}</div>
                <div class="project-card__tags">${tags}</div>
                <div class="project-card__links">${links}</div>
            </div>`
        }).join('')

        return `<div class="app-label">Projects</div>${filters}<div class="projects-grid" id="projects-grid">${cards}</div>`
    },
    onMount(el) {
        const filters = el.querySelectorAll('.projects-filter')
        const cards = el.querySelectorAll('.project-card')
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(f => f.classList.remove('projects-filter--active'))
                btn.classList.add('projects-filter--active')
                const key = btn.dataset.filter
                cards.forEach(card => {
                    card.style.display = (key === 'all' || card.dataset.cat === key) ? '' : 'none'
                })
            })
        })
    }
})

// ─── EXPERIENCE ──────────────────────────────────────────
const experience = makeApp({
    id: 'experience',
    title: 'Experience',
    icon: '💼',
    width: 620,
    height: 520,
    render() {
        const cards = (EXPERIENCE || []).map(exp => {
            const desc = (exp.description || []).map(d => `<li>${d}</li>`).join('')
            const tags = (exp.tags || []).map(t => `<span class="exp-tag">${t}</span>`).join('')
            return `<div class="exp-card">
                <div class="exp-dot"></div>
                <div class="exp-content">
                    <div class="exp-header">
                        <span class="exp-emoji">${exp.emoji || '💼'}</span>
                        <div class="exp-info">
                            <div class="exp-role">${exp.role}</div>
                            <div class="exp-company">${exp.company}</div>
                        </div>
                        <div class="exp-meta">
                            <div class="exp-duration">${exp.duration}</div>
                            ${exp.type ? `<span class="exp-type">${exp.type}</span>` : ''}
                        </div>
                    </div>
                    ${desc ? `<ul class="exp-list">${desc}</ul>` : ''}
                    ${tags ? `<div class="exp-tags">${tags}</div>` : ''}
                </div>
            </div>`
        }).join('')

        return `<div class="app-label">Experience</div><div class="exp-timeline">${cards}</div>`
    }
})

// ─── EDUCATION ───────────────────────────────────────────
const education = makeApp({
    id: 'education',
    title: 'Education',
    icon: '🎓',
    width: 560,
    height: 420,
    render() {
        const cards = (EDUCATION || []).map(edu => `
            <div class="edu-card">
                <div class="edu-icon">${edu.emoji || '🎓'}</div>
                <div class="edu-body">
                    <div class="edu-degree">${edu.degree}</div>
                    <div class="edu-institution">${edu.institution}</div>
                    <div class="edu-meta">
                        <span>${edu.year}</span>
                        ${edu.grade ? `<span class="edu-grade">${edu.grade}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('')

        return `<div class="app-label">Education</div><div class="edu-grid">${cards}</div>`
    }
})

// ─── CERTIFICATES ────────────────────────────────────────
const certificates = makeApp({
    id: 'certificates',
    title: 'Certificates',
    icon: '📜',
    width: 520,
    height: 440,
    render() {
        const cards = (CERTIFICATES || []).map(c => `
            <div class="cert-card">
                <div class="cert-icon" style="--col:${c.col || '#7c3aed'}">${c.abbr}</div>
                <div class="cert-body">
                    <div class="cert-title">${c.title}</div>
                    <div class="cert-issuer">${c.issuer}</div>
                    ${c.date ? `<div class="cert-date">${c.date}</div>` : ''}
                    ${c.badge ? `<span class="cert-badge">${c.badge}</span>` : ''}
                </div>
                ${c.viewUrl ? `<a href="${c.viewUrl}" target="_blank" class="cert-link">View</a>` : ''}
            </div>
        `).join('')

        return `<div class="app-label">Certificates</div><div class="certs-grid">${cards}</div>`
    }
})

// ─── CODING PROFILES ─────────────────────────────────────
const coding = makeApp({
    id: 'coding',
    title: 'Coding Profiles',
    icon: '💻',
    width: 520,
    height: 480,
    render() {
        const activeProfiles = Object.entries(USERNAMES || {}).filter(([, u]) => u?.trim())
        const cards = activeProfiles.map(([id, username]) => {
            const meta = PLATFORMS[id]
            if (!meta) return ''
            return `<a href="${meta.url}" target="_blank" class="coding-card" data-platform="${id}">
                <span class="coding-abbr">${meta.abbr}</span>
                <div class="coding-info">
                    <div class="coding-name">${meta.name}</div>
                    <div class="coding-user">@${username}</div>
                    <div class="coding-loading" id="coding-stats-${id}">Loading stats...</div>
                </div>
                ${meta.live ? '<span class="coding-live">LIVE</span>' : ''}
            </a>`
        }).join('')

        return `<div class="app-label">Coding Profiles</div><div class="coding-grid">${cards}</div>`
    },
    onMount(el) {
        // Fetch live stats with notifications
        if (USERNAMES.github) {
            fetchGitHub(USERNAMES.github).then(data => {
                const target = el.querySelector('#coding-stats-github')
                if (!target) return
                if (data) {
                    target.className = 'coding-stats'
                    target.innerHTML = `<span class="coding-stat">${data.stars} Stars</span><span class="coding-stat">${data.repos} Repos</span><span class="coding-stat">${data.followers} Followers</span>`
                } else target.textContent = 'Stats unavailable'
            })
        }
        if (USERNAMES.leetcode) {
            fetchLeetCode(USERNAMES.leetcode).then(data => {
                const target = el.querySelector('#coding-stats-leetcode')
                if (!target) return
                if (data) {
                    target.className = 'coding-stats'
                    target.innerHTML = `<span class="coding-stat">${data.totalSolved} Solved</span><span class="coding-stat">Rank #${data.ranking?.toLocaleString()}</span>`
                } else target.textContent = 'Stats unavailable'
            })
        }
        if (USERNAMES.codeforces) {
            fetchCodeforces(USERNAMES.codeforces).then(data => {
                const target = el.querySelector('#coding-stats-codeforces')
                if (!target) return
                if (data) {
                    target.className = 'coding-stats'
                    target.innerHTML = `<span class="coding-stat">${data.rating} Rating</span><span class="coding-stat">${data.rank}</span><span class="coding-stat">${data.solvedCount} Solved</span>`
                } else target.textContent = 'Stats unavailable'
            })
        }
    }
})

// ─── CONTACT ─────────────────────────────────────────────
const contact = makeApp({
    id: 'contact',
    title: 'Contact',
    icon: '📧',
    width: 480,
    height: 460,
    render() {
        const items = (CONTACT_ITEMS || []).filter(c => c.href?.trim()).map(c => `
            <a href="${c.href}" target="_blank" class="contact-item">
                <span class="contact-icon">${c.icon}</span>
                <div>
                    <div class="contact-label">${c.label}</div>
                    <div class="contact-value">${c.sub}</div>
                </div>
            </a>
        `).join('')

        const socials = (SOCIAL_LINKS || []).filter(s => s.url?.trim()).map(s =>
            `<a href="${s.url}" target="_blank" class="contact-social" title="${s.label}">${s.emoji}</a>`
        ).join('')

        return `
            <div class="app-label">Get in Touch</div>
            <div class="app-heading" style="font-size:1.2rem;margin-bottom:16px">Let's Build Something Great</div>
            <div class="contact-grid">${items}</div>
            ${socials ? `<div class="contact-socials">${socials}</div>` : ''}
        `
    }
})

// ─── TERMINAL ────────────────────────────────────────────
const terminal = makeApp({
    id: 'terminal',
    title: 'Terminal',
    icon: '>_',
    width: 620,
    height: 440,
    windowClass: 'window--terminal',
    render() {
        return `
            <div class="term">
                <div class="term__output" id="term-output">
                    <div class="term__welcome">Welcome to PortfolioOS Terminal v1.0</div>
                    <div class="term__welcome">Type <span class="term__info">'help'</span> for available commands.</div>
                    <div class="term__line">&nbsp;</div>
                </div>
                <div class="term__input-line">
                    <span class="term__prompt">saksham@portfolio:~$</span>
                    <input class="term__input" id="term-input" type="text" autocomplete="off" spellcheck="false" />
                </div>
            </div>
        `
    },
    onMount(el, { openWindow: owFn }) {
        createTerminal(el, APP_REGISTRY, owFn)
    }
})

// ─── REGISTRY ────────────────────────────────────────────
export const APP_REGISTRY = {
    about,
    skills,
    projects,
    experience,
    education,
    certificates,
    coding,
    contact,
    terminal,
}
