import './style.css'
import {
    CORE,
    PERSONAL,
    SOCIAL_LINKS,
    SKILLS,
    PROJECTS,
    CERTIFICATES,
    EDUCATION,
    EXPERIENCE,
    USERNAMES,
    PLATFORMS,
} from './data/data.js'
import { fetchGitHub, fetchLeetCode, fetchCodeforces } from './api.js'

function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function isRealUrl(url) {
    return Boolean(url && url !== '#')
}

function linkList(items) {
    return items
        .filter((item) => isRealUrl(item.href))
        .map((item) => `<a href="${esc(item.href)}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(item.label)}</a>`)
        .join('')
}

function renderProjects() {
    return (PROJECTS || []).map((project) => {
        const tags = (project.tags || []).map((tag) => `<li>${esc(tag)}</li>`).join('')
        const links = [
            isRealUrl(project.liveUrl) ? `<a href="${esc(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Live</a>` : '',
            isRealUrl(project.demoUrl) ? `<a href="${esc(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Demo</a>` : '',
            isRealUrl(project.codeUrl) ? `<a href="${esc(project.codeUrl)}" target="_blank" rel="noopener noreferrer">Code</a>` : '',
        ].filter(Boolean).join('<span class="sep" aria-hidden="true">/</span>')

        return `
            <article class="work-item">
                <div class="work-item__meta">
                    <span class="work-item__index">${esc(project.index || String(project.id).padStart(2, '0'))}</span>
                    <span class="work-item__kind">${esc(project.kind || 'Project')}</span>
                </div>
                <div class="work-item__body">
                    <h3>${esc(project.title)}</h3>
                    <p>${esc(project.desc)}</p>
                    <ul class="tags">${tags}</ul>
                    ${links ? `<div class="work-item__links">${links}</div>` : ''}
                </div>
            </article>
        `
    }).join('')
}

function renderExperience() {
    return (EXPERIENCE || []).map((job) => {
        const points = (job.description || []).map((line) => `<li>${esc(line)}</li>`).join('')
        const tags = (job.tags || []).map((tag) => `<li>${esc(tag)}</li>`).join('')
        return `
            <article class="job">
                <header class="job__head">
                    <div>
                        <h3>${esc(job.role)}</h3>
                        <p class="job__company">${esc(job.company)}</p>
                    </div>
                    <p class="job__when">${esc(job.duration)}${job.type ? ` · ${esc(job.type)}` : ''}</p>
                </header>
                ${points ? `<ul class="job__points">${points}</ul>` : ''}
                ${tags ? `<ul class="tags">${tags}</ul>` : ''}
            </article>
        `
    }).join('')
}

function renderSkills() {
    return Object.entries(SKILLS || {})
        .filter(([, items]) => items?.length)
        .map(([group, items]) => `
            <div class="stack-group">
                <h3>${esc(group)}</h3>
                <ul>${items.map((item) => `<li>${esc(item.label)}</li>`).join('')}</ul>
            </div>
        `).join('')
}

function renderEducation() {
    return (EDUCATION || []).map((edu) => `
        <article class="edu">
            <h3>${esc(edu.degree)}</h3>
            <p>${esc(edu.institution)}</p>
            <p class="edu__meta">${esc(edu.year)}${edu.grade ? ` · ${esc(edu.grade)}` : ''}</p>
        </article>
    `).join('')
}

function renderCertificates() {
    return (CERTIFICATES || []).map((cert) => {
        const title = isRealUrl(cert.viewUrl)
            ? `<a href="${esc(cert.viewUrl)}" target="_blank" rel="noopener noreferrer">${esc(cert.title)}</a>`
            : esc(cert.title)
        return `<li><span>${title}</span><span>${esc(cert.issuer)} · ${esc(cert.date)}</span></li>`
    }).join('')
}

function renderProfiles() {
    return Object.entries(USERNAMES || {})
        .filter(([, username]) => username?.trim())
        .map(([id, username]) => {
            const meta = PLATFORMS[id]
            if (!meta) return ''
            return `
                <a class="profile" href="${esc(meta.url)}" target="_blank" rel="noopener noreferrer" data-platform="${esc(id)}">
                    <span class="profile__name">${esc(meta.name)}</span>
                    <span class="profile__user">@${esc(username)}</span>
                    <span class="profile__stats" id="stats-${esc(id)}" data-loading="true">Live stats loading…</span>
                </a>
            `
        }).join('')
}

function render() {
    const socials = (SOCIAL_LINKS || [])
        .filter((item) => isRealUrl(item.url))
        .map((item) => ({ label: item.label, href: item.url, external: true }))

    const nav = [
        { href: '#work', label: 'Work' },
        EXPERIENCE?.length ? { href: '#experience', label: 'Experience' } : null,
        { href: '#stack', label: 'Stack' },
        { href: '#about', label: 'About' },
        { href: '#contact', label: 'Contact' },
    ].filter(Boolean)

    const navLinks = nav.map((item) => `<a href="${item.href}" data-nav-link>${item.label}</a>`).join('')

    document.getElementById('app').innerHTML = `
        <div class="frame">
            <aside class="rail">
                <a class="mark" href="#top">${esc(PERSONAL.shortName || PERSONAL.name)}</a>
                <nav class="nav" aria-label="Sections">
                    ${navLinks}
                </nav>
                <div class="rail__foot">
                    ${PERSONAL.available ? '<p class="status">Open to work</p>' : ''}
                    <p class="locale">${esc(CORE.location)}</p>
                </div>
            </aside>

            <main id="top">
                <header class="hero">
                    <p class="eyebrow">MERN · Full stack · ${esc(CORE.location)}</p>
                    <h1>${esc(PERSONAL.name)}</h1>
                    <p class="lede">${esc(PERSONAL.tagline)}. I ship interfaces, APIs, and the glue between them — then keep going until the product actually works.</p>
                    <div class="hero__actions">
                        <a class="btn" href="mailto:${esc(CORE.email)}">Email me</a>
                        ${linkList(socials)}
                    </div>
                </header>

                <section id="work" class="section">
                    <div class="section__head">
                        <p class="eyebrow">Selected work</p>
                        <h2>Things I have actually built.</h2>
                    </div>
                    <div class="work-list">
                        ${renderProjects()}
                    </div>
                </section>

                ${EXPERIENCE?.length ? `
                <section id="experience" class="section">
                    <div class="section__head">
                        <p class="eyebrow">Experience</p>
                        <h2>Where the hours went.</h2>
                    </div>
                    <div class="jobs">${renderExperience()}</div>
                </section>` : ''}

                <section id="stack" class="section">
                    <div class="section__head">
                        <p class="eyebrow">Stack</p>
                        <h2>Tools I reach for.</h2>
                    </div>
                    <div class="stack">${renderSkills()}</div>
                    <div class="profiles" id="profiles">${renderProfiles()}</div>
                </section>

                <section id="about" class="section">
                    <div class="section__head">
                        <p class="eyebrow">About</p>
                        <h2>Short version.</h2>
                    </div>
                    <div class="about">
                        <div class="about__copy">
                            ${(PERSONAL.bio || []).map((p) => `<p>${esc(p)}</p>`).join('')}
                        </div>
                        <div class="about__aside">
                            ${renderEducation()}
                            ${CERTIFICATES?.length ? `
                                <div class="certs">
                                    <h3>Certificates</h3>
                                    <ul>${renderCertificates()}</ul>
                                </div>` : ''}
                        </div>
                    </div>
                </section>

                <section id="contact" class="section section--contact">
                    <p class="eyebrow">Contact</p>
                    <h2>Let’s talk.</h2>
                    <p class="lede">If you need a MERN developer who can own a feature from schema to UI, write.</p>
                    <div class="hero__actions">
                        <a class="btn btn--wrap" href="mailto:${esc(CORE.email)}">${esc(CORE.email)}</a>
                        <a href="tel:${esc(CORE.phone.replace(/\s/g, ''))}">${esc(CORE.phone)}</a>
                        ${linkList(socials)}
                    </div>
                </section>

                <footer class="site-foot">
                    <span>© ${new Date().getFullYear()} ${esc(PERSONAL.name)}</span>
                    <span>Selected work, then the rest.</span>
                </footer>
            </main>
        </div>

        <button class="menu-fab" type="button" aria-expanded="false" aria-controls="menu-popup">
            <span class="menu-fab__icon" aria-hidden="true"></span>
            <span class="visually-hidden">Open menu</span>
        </button>
        <div class="menu-popup" id="menu-popup" role="dialog" aria-modal="true" aria-label="Menu" hidden>
            <button class="menu-popup__close" type="button">Close</button>
            <p class="menu-popup__name">${esc(PERSONAL.shortName || PERSONAL.name)}</p>
            <nav class="menu-popup__nav">
                ${navLinks}
            </nav>
        </div>
    `
}

function setStat(id, html) {
    const el = document.getElementById(`stats-${id}`)
    if (!el) return
    el.removeAttribute('data-loading')
    el.innerHTML = html
}

async function loadProfileStats() {
    if (USERNAMES.github) {
        const data = await fetchGitHub(USERNAMES.github)
        setStat('github', data
            ? `${data.repos} repos · ${data.stars} stars · ${data.followers} followers`
            : 'Stats unavailable')
    }
    if (USERNAMES.leetcode) {
        const data = await fetchLeetCode(USERNAMES.leetcode)
        setStat('leetcode', data
            ? `${data.totalSolved} solved · rank #${Number(data.ranking || 0).toLocaleString()}`
            : 'Stats unavailable')
    }
    if (USERNAMES.codeforces) {
        const data = await fetchCodeforces(USERNAMES.codeforces)
        setStat('codeforces', data
            ? `${data.rating} rating · ${data.rank} · ${data.solvedCount} solved`
            : 'Stats unavailable')
    }
    if (USERNAMES.hackerrank && !PLATFORMS.hackerrank?.live) {
        setStat('hackerrank', 'Profile')
    }
}

function watchNav() {
    const links = [...document.querySelectorAll('[data-nav-link]')]
    const sections = [...new Set(
        links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean)
    )]

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        links.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`)
        })
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] })

    sections.forEach((section) => observer.observe(section))
}

function initMobileNav() {
    const fab = document.querySelector('.menu-fab')
    const popup = document.getElementById('menu-popup')
    const closeBtn = document.querySelector('.menu-popup__close')
    if (!fab || !popup || !closeBtn) return

    const label = fab.querySelector('.visually-hidden')

    const setOpen = (open) => {
        fab.classList.toggle('is-open', open)
        fab.setAttribute('aria-expanded', String(open))
        if (label) label.textContent = open ? 'Close menu' : 'Open menu'
        popup.hidden = !open
    }

    fab.addEventListener('click', (event) => {
        event.stopPropagation()
        setOpen(popup.hidden)
    })

    closeBtn.addEventListener('click', () => setOpen(false))

    // Close when a nav link inside popup is clicked
    popup.querySelectorAll('[data-nav-link]').forEach((link) => {
        link.addEventListener('click', () => setOpen(false))
    })

    // Close when clicking anywhere outside the popup or FAB
    document.addEventListener('click', (event) => {
        if (!popup.hidden && !popup.contains(event.target) && !fab.contains(event.target)) {
            setOpen(false)
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popup.hidden) setOpen(false)
    })
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setOpen(false)
    })
}

render()
watchNav()
initMobileNav()
loadProfileStats()
