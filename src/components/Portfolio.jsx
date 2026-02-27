import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PERSONAL, TYPED_ROLES, HERO_STATS,
    SKILLS, PROJECTS, PROJECT_FILTERS,
    SOCIAL_LINKS, CONTACT_ITEMS,
    CERTIFICATES, EDUCATION, EXPERIENCE,
    USERNAMES, PLATFORMS, CORE
} from '../data/data'
import '../styles/sections.css'
import useGitHub from '../hooks/useGitHub'
import useLeetCode from '../hooks/useLeetCode'
import useCodeforces from '../hooks/useCodeforces'
import useInView from '../hooks/useInView'

/**
 * LazySection — only mounts children once the section
 * scrolls within 200px of the viewport.
 * Renders a transparent placeholder until then so the
 * page layout / scroll position never jumps.
 */
function LazySection({ id, className, minHeight = '100dvh', children }) {
    const [ref, visible] = useInView({ rootMargin: '200px' })
    return (
        <section
            ref={ref}
            id={id}
            className={className}
            style={!visible ? { minHeight } : undefined}
        >
            {visible ? children : null}
        </section>
    )
}


/* ── Typing effect ── */
function TypingText({ texts, speed = 90, pause = 2200 }) {
    const [idx, setIdx] = useState(0)
    const [display, setDisplay] = useState('')
    const [deleting, setDeleting] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!texts?.length) return
        const current = texts[idx]
        timerRef.current = setTimeout(() => {
            if (!deleting) {
                setDisplay(current.slice(0, display.length + 1))
                if (display.length + 1 === current.length)
                    setTimeout(() => setDeleting(true), pause)
            } else {
                setDisplay(current.slice(0, display.length - 1))
                if (display.length === 0) { setDeleting(false); setIdx((idx + 1) % texts.length) }
            }
        }, deleting ? speed / 2 : speed)
        return () => clearTimeout(timerRef.current)
    }, [display, deleting, idx, texts, speed, pause])

    return <span className="pi-hero__typed">{display}<span className="pi-hero__cursor">|</span></span>
}

/* ── Animated counter ── */
function Counter({ target, duration = 2000 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true
                const start = performance.now()
                const step = ts => {
                    const progress = Math.min((ts - start) / duration, 1)
                    setCount(Math.floor(progress * target))
                    if (progress < 1) requestAnimationFrame(step)
                }
                requestAnimationFrame(step)
            }
        }, { threshold: 0.3 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, duration])

    return <span ref={ref}>{count}+</span>
}

/**
 * GlintName — Premium Optical Refraction Effect
 * A sharp light beam (glint) follows the mouse position across the text.
 */
function GlintName({ name }) {
    const ref = useRef(null)
    const [glintPos, setGlintPos] = useState(-100)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        setGlintPos(x)
    }

    return (
        <div
            className={`pi-hero__name-container${isHovered ? ' pi-hero__name-container--hover' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setGlintPos(-100) }}
            onMouseMove={handleMouseMove}
        >
            <h1
                ref={ref}
                className="pi-hero__name"
                style={{ '--glint-x': `${glintPos}%` }}
            >
                {name}
            </h1>
        </div>
    )
}

/* ── All Sections (dynamic — only includes sections that have data) ── */
function getSections() {
    const sections = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
    ]

    const allSkills = Object.entries(SKILLS ?? {}).filter(([, arr]) => arr?.length)
    if (allSkills.length > 0) sections.push({ id: 'skills', label: 'Skills' })
    if (EXPERIENCE?.length > 0) sections.push({ id: 'experience', label: 'Experience' })
    if (EDUCATION?.length > 0) sections.push({ id: 'education', label: 'Education' })
    if (PROJECTS?.length > 0) sections.push({ id: 'projects', label: 'Projects' })
    if (CERTIFICATES?.length > 0) sections.push({ id: 'certificates', label: 'Certs' })

    const activeProfiles = Object.entries(USERNAMES ?? {}).filter(([, u]) => u?.trim())
    if (activeProfiles.length > 0) sections.push({ id: 'coding', label: 'Coding' })

    sections.push({ id: 'contact', label: 'Contact' })
    return sections
}

const SECTIONS = getSections()

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ParticlePortfolio() {
    const [active, setActive] = useState('hero')
    const [projFilter, setProjFilter] = useState('all')
    const [menuOpen, setMenuOpen] = useState(false)
    const [headerScrolled, setHeaderScrolled] = useState(false)
    const [isDark, setIsDark] = useState(() => {
        // persist preference
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'dark' : true // default: dark
    })

    // Apply theme to root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark])

    // ── Fetch live stats ──────────────────────────────────────────
    const github = useGitHub(USERNAMES.github)
    const leetcode = useLeetCode(USERNAMES.leetcode)
    const codeforces = useCodeforces(USERNAMES.codeforces)
    const liveStats = { github, leetcode, codeforces }

    /* ── Scroll detection — find closest section to viewport center ── */
    useEffect(() => {
        const detect = () => {
            const vh = window.innerHeight
            let best = 'hero'
            let bestDist = Infinity
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id)
                if (!el) continue
                const rect = el.getBoundingClientRect()
                // Distance from section's vertical center to viewport center
                const mid = rect.top + rect.height / 2
                const dist = Math.abs(mid - vh / 2)
                if (dist < bestDist) { bestDist = dist; best = s.id }
            }
            setActive(prev => prev !== best ? best : prev)
        }

        detect()
        window.addEventListener('scroll', detect, { passive: true })
        return () => window.removeEventListener('scroll', detect)
    }, [])

    // Header scroll effect
    useEffect(() => {
        const onScroll = () => setHeaderScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = id => {
        const el = document.getElementById(id)
        if (el) {
            const offset = 0 // adjust if needed
            const top = el.getBoundingClientRect().top + window.pageYOffset - offset
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    const navTo = useCallback(id => {
        setMenuOpen(false)
        setTimeout(() => scrollTo(id), 50)
    }, [])

    /* ── Derived data ── */
    const email = (PERSONAL.details ?? []).find(d => d.label?.toLowerCase().includes('email'))?.value
    const activeSocials = (SOCIAL_LINKS ?? []).filter(s => s.url?.trim())
    const activeContacts = (CONTACT_ITEMS ?? []).filter(s => s.href?.trim())
    const allSkills = Object.entries(SKILLS ?? {}).filter(([, arr]) => arr?.length)
    const activeProfiles = Object.entries(USERNAMES ?? {}).filter(([, u]) => u?.trim())
    const filteredProjects = projFilter === 'all'
        ? PROJECTS
        : (PROJECTS ?? []).filter(p => p.cat === projFilter)

    return (
        <>
            {/* ── Sticky Header ── */}
            <header className={`pi-header${headerScrolled ? ' pi-header--scrolled' : ''}`}>
                <div className="pi-header__inner">
                    {/* Desktop nav — right */}
                    <nav className="pi-header__nav" aria-label="Primary navigation">
                        {SECTIONS.map(s => (
                            <button
                                key={s.id}
                                className={`pi-header__link${active === s.id ? ' pi-header__link--active' : ''}`}
                                onClick={() => navTo(s.id)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </nav>

                    {/* Dark/Light Toggle — far right corner */}
                    <button
                        className="pi-header__theme-toggle"
                        onClick={() => setIsDark(d => !d)}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDark ? 'Light mode' : 'Dark mode'}
                    >
                        <span className="pi-header__toggle-track">
                            <span className="pi-header__toggle-thumb">
                                {isDark ? '🌙' : '☀️'}
                            </span>
                        </span>
                    </button>

                    {/* Hamburger (mobile) */}
                    <button
                        className={`pi-header__burger${menuOpen ? ' pi-header__burger--open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span /><span /><span />
                    </button>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.nav
                            className="pi-header__drawer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            {SECTIONS.map(s => (
                                <button
                                    key={s.id}
                                    className={`pi-header__drawer-link${active === s.id ? ' pi-header__drawer-link--active' : ''}`}
                                    onClick={() => navTo(s.id)}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Aurora gradient background ── */}
            <div className="pi-aurora" aria-hidden="true">
                <div className="pi-aurora__orb pi-aurora__orb--1" />
                <div className="pi-aurora__orb pi-aurora__orb--2" />
                <div className="pi-aurora__orb pi-aurora__orb--3" />
                <div className="pi-aurora__orb pi-aurora__orb--4" />
            </div>

            {/* ── Side nav dots ── */}
            <nav className="pi-nav" aria-label="Section navigation">
                {SECTIONS.map(s => (
                    <button
                        key={s.id}
                        className={`pi-nav__dot ${active === s.id ? 'pi-nav__dot--active' : ''}`}
                        onClick={() => scrollTo(s.id)}
                        title={s.label}
                        aria-label={s.label}
                    />
                ))}
            </nav>

            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="pi-section pi-hero" id="hero">
                <motion.div className="pi-hero__content" initial="hidden" whileInView="visible"
                    viewport={{ once: true }} variants={fadeUp}>

                    {/* Technical Grid Accent */}
                    <div className="pi-hero__grid-bg" />

                    {PERSONAL.available && (
                        <motion.div className="pi-hero__badge"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}>
                            <span className="pi-hero__badge-dot" />
                            Available for opportunities
                        </motion.div>
                    )}

                    <p className="pi-hero__greeting pi-hero__greeting--alt">
                        Software Engineer & Creative Developer
                    </p>

                    <GlintName name={PERSONAL.name} />

                    <div className="pi-hero__role pi-hero__role--typed">
                        {TYPED_ROLES?.length > 0 && <TypingText texts={TYPED_ROLES} />}
                    </div>

                    {/* ── Consolidated Stats Pill ── */}
                    {HERO_STATS?.length > 0 && (
                        <motion.div className="pi-hero__stats-pill"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}>
                            {HERO_STATS.map((stat) => (
                                <div key={stat.label} className="pi-hero__stat-item">
                                    <span className="pi-hero__stat-val"><Counter target={stat.target} /></span>
                                    <span className="pi-hero__stat-lbl">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    <div className="pi-hero__actions">
                        {PERSONAL.resumeUrl && PERSONAL.resumeUrl !== '#' && (
                            <a href={PERSONAL.resumeUrl} className="btn btn-primary" target="_blank" rel="noreferrer">📄 Resume</a>
                        )}
                        <button className="btn btn-outline" onClick={() => scrollTo('contact')}>💬 Let's Talk</button>
                    </div>

                    {/* ── Social links in hero ── */}
                    {activeSocials.length > 0 && (
                        <div className="pi-hero__socials">
                            {activeSocials.map(s => (
                                <motion.a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                                    className="pi-hero__social" title={s.label}
                                    whileHover={{ scale: 1.2, y: -2 }}>
                                    {s.emoji}
                                </motion.a>
                            ))}
                        </div>
                    )}

                    <div className="pi-hero__scroll-hint">
                        <span>Scroll to explore</span>
                        <span className="pi-hero__scroll-arrow">↓</span>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════ ABOUT ═══════════════════ */}
            <LazySection id="about" className="pi-section">
                <div className="pi-about">

                    {/* ── Section label ── */}
                    <motion.p className="pi-label"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}>
                        About Me
                    </motion.p>

                    <div className="pi-about__grid">
                        {/* ── Left: Bio + chips ── */}
                        <div className="pi-about__left">

                            {/* Bio paragraphs — each slides up individually */}
                            {(PERSONAL.bio ?? []).map((p, i) => (
                                <motion.p key={i} className="pi-about__bio"
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 0.4, delay: 0.05 + i * 0.08, ease: 'easeOut' }}>
                                    {p}
                                </motion.p>
                            ))}

                            {/* ── Bio Footer Details (Degree & Location) ── */}
                            <motion.div className="pi-about__footer-details"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 }}>
                                <div className="pi-about__footer-item">
                                    <span className="pi-about__footer-icon">🎓</span>
                                    <span>{EDUCATION[0].degree}</span>
                                </div>
                                <div className="pi-about__footer-item">
                                    <span className="pi-about__footer-icon">📍</span>
                                    <span>{CORE.location}</span>
                                </div>
                            </motion.div>

                            {/* Chips — icons + labels */}
                            {PERSONAL.chips?.length > 0 && (
                                <motion.div className="pi-about__chips"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.3, delay: 0.35 }}>
                                    {PERSONAL.chips.map((c, i) => (
                                        <motion.span key={i} className="pi-about__chip"
                                            initial={{ opacity: 0, scale: 0.75, y: 10 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.35, delay: 0.4 + i * 0.06, ease: 'backOut' }}>
                                            {c.icon} {c.text}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            )}

                            {/* Resume button */}
                            {PERSONAL.resumeUrl && PERSONAL.resumeUrl !== '#' && (
                                <motion.a href={PERSONAL.resumeUrl} className="btn btn-ghost pi-about__resume"
                                    target="_blank" rel="noreferrer"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.45, delay: 0.5 }}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    📄 Download Resume
                                </motion.a>
                            )}
                        </div>

                        {/* ── Right: Profile Image Spotlight ── */}
                        <motion.div className="pi-about__right"
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
                            <div className="pi-about__image-wrapper">
                                <div className="pi-about__image-accent" />
                                <div className="pi-about__image-frame">
                                    {/* Using a high-end placeholder if user hasn't provided one */}
                                    <div className="pi-about__image-placeholder">
                                        <span>{PERSONAL.name.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </LazySection>

            {/* ═══════════════════ SKILLS ═══════════════════ */}
            {allSkills.length > 0 && (
                <LazySection id="skills" className="pi-section">
                    <motion.div className="pi-skills__card" initial="hidden" whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
                        <p className="pi-label">Tech Stack</p>
                        {allSkills.map(([cat, items]) => (
                            <div key={cat} className="pi-skills__group">
                                <p className="pi-skills__cat">{cat}</p>
                                <div className="pi-skills__tags">
                                    {items.map((s, i) => (
                                        <motion.span key={s.label} className="pi-skills__tag"
                                            style={{ '--accent-color': s.accent }}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.03 * i }}>
                                            <span className="pi-skills__dot" style={{ background: 'var(--accent-color)' }} />
                                            {s.label}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </LazySection>
            )
            }

            {/* ═══════════════════ EXPERIENCE ═══════════════════ */}
            {
                EXPERIENCE?.length > 0 && (
                    <LazySection id="experience" className="pi-section">
                        <div className="pi-exp__wrap">
                            <motion.p className="pi-label pi-label--center"
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                Experience
                            </motion.p>
                            <div className="pi-exp__timeline">
                                {EXPERIENCE.map((exp, i) => (
                                    <motion.div key={exp.role + i} className="pi-exp-card"
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.1 * i }}>
                                        <div className="pi-exp-card__dot" />
                                        <div className="pi-exp-card__content">
                                            <div className="pi-exp-card__header">
                                                <span className="pi-exp-card__emoji">{exp.emoji || '💼'}</span>
                                                <div>
                                                    <h4 className="pi-exp-card__role">{exp.role}</h4>
                                                    <p className="pi-exp-card__company">{exp.company}</p>
                                                </div>
                                                <div className="pi-exp-card__meta">
                                                    <span className="pi-exp-card__duration">{exp.duration}</span>
                                                    {exp.type && <span className="pi-exp-card__type">{exp.type}</span>}
                                                </div>
                                            </div>
                                            {(exp.description ?? []).length > 0 && (
                                                <ul className="pi-exp-card__list">
                                                    {exp.description.map((d, j) => <li key={j}>{d}</li>)}
                                                </ul>
                                            )}
                                            {(exp.tags ?? []).length > 0 && (
                                                <div className="pi-exp-card__tags">
                                                    {exp.tags.map(t => <span key={t} className="pi-exp-card__tag">{t}</span>)}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </LazySection>
                )
            }

            {/* ═══════════════════ EDUCATION ═══════════════════ */}
            {
                EDUCATION?.length > 0 && (
                    <LazySection id="education" className="pi-section">
                        <div className="pi-edu__wrap">
                            <motion.p className="pi-label pi-label--center"
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                Education
                            </motion.p>
                            <div className="pi-edu__timeline">
                                {EDUCATION.map((edu, i) => (
                                    <motion.div key={edu.degree + i} className="pi-edu-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.1 * i }}>
                                        <div className="pi-edu-card__icon">{edu.emoji || '🎓'}</div>
                                        <div className="pi-edu-card__content">
                                            <h4 className="pi-edu-card__degree">{edu.degree}</h4>
                                            <p className="pi-edu-card__institution">{edu.institution}</p>
                                            <div className="pi-edu-card__meta">
                                                <span className="pi-edu-card__year">📅 {edu.year}</span>
                                                {edu.grade && <span className="pi-edu-card__grade">🏅 {edu.grade}</span>}
                                            </div>
                                            {edu.description && <p className="pi-edu-card__desc">{edu.description}</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </LazySection>
                )
            }

            {/* ═══════════════════ PROJECTS (with filter tabs) ═══════════════════ */}
            {
                PROJECTS?.length > 0 && (
                    <LazySection id="projects" className="pi-section">
                        <div className="pi-projects__wrap">
                            <motion.p className="pi-label pi-label--center"
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                Projects
                            </motion.p>

                            {/* ── Filter tabs ── */}
                            {PROJECT_FILTERS?.length > 1 && (
                                <div className="pi-projects__filters">
                                    {PROJECT_FILTERS.map(f => (
                                        <button key={f.key}
                                            className={`pi-projects__filter ${projFilter === f.key ? 'pi-projects__filter--active' : ''}`}
                                            onClick={() => setProjFilter(f.key)}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="pi-projects__grid">
                                <AnimatePresence mode="popLayout">
                                    {filteredProjects.map((p, i) => (
                                        <motion.div key={p.id} className="pi-project-card"
                                            layout
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: 0.04 * i, duration: 0.35 }}>
                                            <span className="pi-project-card__emoji">{p.emoji}</span>
                                            <h3 className="pi-project-card__title">{p.title}</h3>
                                            <p className="pi-project-card__desc">{p.desc}</p>
                                            <div className="pi-project-card__tags">
                                                {(p.tags ?? []).map(t => <span key={t} className="pi-project-card__tag">{t}</span>)}
                                            </div>
                                            <div className="pi-project-card__links">
                                                {p.liveUrl && p.liveUrl !== '#' && (
                                                    <a href={p.liveUrl} className="pi-project-card__link" target="_blank" rel="noreferrer">Live ⚡</a>
                                                )}
                                                {p.demoUrl && p.demoUrl !== '#' && (
                                                    <a href={p.demoUrl} className="pi-project-card__link" target="_blank" rel="noreferrer">Demo ↗</a>
                                                )}
                                                {p.codeUrl && p.codeUrl !== '#' && (
                                                    <a href={p.codeUrl} className="pi-project-card__link" target="_blank" rel="noreferrer">Code ↗</a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </LazySection>
                )
            }

            {/* ═══════════════════ CERTIFICATES ═══════════════════ */}
            {
                CERTIFICATES?.length > 0 && (
                    <LazySection id="certificates" className="pi-section">
                        <div className="pi-certs__wrap">
                            <motion.p className="pi-label" style={{ textAlign: 'center' }}
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                Certificates & Achievements
                            </motion.p>
                            <div className="pi-certs__grid">
                                {CERTIFICATES.map((c, i) => (
                                    <motion.div key={c.title || i} className="pi-cert-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.08 * i }}>
                                        <div className="pi-cert-card__icon" style={{ '--col': c.col || '#7c3aed' }}>{c.abbr}</div>
                                        <div className="pi-cert-card__body">
                                            <h4 className="pi-cert-card__title">{c.title}</h4>
                                            <p className="pi-cert-card__issuer">{c.issuer}</p>
                                            {c.date && <p className="pi-cert-card__date">📅 {c.date}</p>}
                                            {c.badge && (
                                                <span className={`pi-cert-card__badge ${c.gold ? 'pi-cert-card__badge--gold' : ''}`}>
                                                    {c.badge}
                                                </span>
                                            )}
                                        </div>
                                        {c.viewUrl && (
                                            <a href={c.viewUrl} target="_blank" rel="noreferrer" className="pi-cert-card__link">
                                                View →
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </LazySection>
                )
            }

            {/* ═══════════════════ CODING PROFILES ═══════════════════ */}
            {
                activeProfiles.length > 0 && (
                    <LazySection id="coding" className="pi-section">
                        <div className="pi-coding__wrap">
                            <motion.p className="pi-label pi-label--center"
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                Coding Profiles
                            </motion.p>
                            <div className="pi-coding__grid">
                                {activeProfiles.map(([id, username], i) => {
                                    const meta = PLATFORMS[id]
                                    if (!meta) return null

                                    // ── Get live data from hooks ──────────────────
                                    const live = liveStats[id]
                                    const hasLive = live && live.data && !live.loading && !live.error

                                    return (
                                        <motion.a key={id} href={meta.url} target="_blank" rel="noreferrer"
                                            className="pi-coding-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.08 * i }}
                                            whileHover={{ y: -4 }}>
                                            <span className="pi-coding-card__abbr">{meta.abbr}</span>
                                            <div className="pi-coding-card__info">
                                                <h4 className="pi-coding-card__name">{meta.name}</h4>
                                                <p className="pi-coding-card__user">@{username}</p>

                                                {/* ── Status indicators ───────────── */}
                                                {live?.loading && <p className="pi-coding-card__stat">Loading live stats...</p>}
                                                {live?.error && <p className="pi-coding-card__stat" style={{ color: '#ef4444' }}>Live stats unavailable</p>}

                                                {/* ── Live Stats Breakdown ────────── */}
                                                {hasLive && (
                                                    <div className="pi-coding-card__stats">
                                                        {id === 'github' && (
                                                            <>
                                                                <span className="pi-coding-card__stat">{live.data.stars} Stars</span>
                                                                <span className="pi-coding-card__stat">{live.data.repos} Repos</span>
                                                                <span className="pi-coding-card__stat">{live.data.followers} Followers</span>
                                                            </>
                                                        )}
                                                        {id === 'leetcode' && (
                                                            <>
                                                                <span className="pi-coding-card__stat">{live.data.totalSolved} Solved</span>
                                                                <span className="pi-coding-card__stat">Rank #{live.data.ranking.toLocaleString()}</span>
                                                            </>
                                                        )}
                                                        {id === 'codeforces' && (
                                                            <>
                                                                <span className="pi-coding-card__stat">{live.data.rating} Rating</span>
                                                                <span className="pi-coding-card__stat">{live.data.rank}</span>
                                                                <span className="pi-coding-card__stat">{live.data.solvedCount} Solved</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* ── Badges ─────────────────────── */}
                                                {hasLive && id === 'leetcode' && live.data.acceptanceRate && (
                                                    <div className="pi-coding-card__badges">
                                                        <span className="pi-coding-card__badge-tag">
                                                            {live.data.acceptanceRate}% Acceptance
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {meta.live && <span className="pi-coding-card__live">🟢 Live</span>}
                                        </motion.a>
                                    )
                                })}
                            </div>
                        </div>
                    </LazySection>
                )
            }

            {/* ═══════════════════ CONTACT ═══════════════════ */}
            <LazySection id="contact" className="pi-section pi-section--contact">
                <div className="pi-contact__container">
                    <div className="pi-contact__grid">
                        <div className="pi-contact__info">
                            <motion.p className="pi-label"
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}>
                                Get in Touch
                            </motion.p>
                            <motion.h2 className="pi-contact__heading"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.1 }}>
                                Let's Build Something Great Together
                            </motion.h2>
                            <motion.p className="pi-contact__text"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.2 }}>
                                I'm always open to new opportunities, collaborations, or just a friendly conversation.
                                Whether you have a project in mind or just want to say hi.
                            </motion.p>

                            {/* ── Social links ── */}
                            {activeSocials.length > 0 && (
                                <div className="pi-contact__socials">
                                    {activeSocials.map((s, i) => (
                                        <motion.a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                                            className="pi-contact__social" title={s.label}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}>
                                            {s.emoji}
                                        </motion.a>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div className="pi-contact__form-wrap">
                            <motion.div className="pi-contact__card" initial="hidden" whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>

                                {/* ── Contact details ── */}
                                {activeContacts.length > 0 && (
                                    <div className="pi-contact__details">
                                        {activeContacts.map((c, i) => (
                                            <div key={c.label} className="pi-contact__detail-item">
                                                <span className="pi-contact__detail-icon">{c.icon}</span>
                                                <div className="pi-contact__detail-text">
                                                    <strong>{c.label}</strong>
                                                    {c.sub && <p>{c.sub}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {email && (
                                    <motion.a href={`mailto:${email}`} className="btn btn-primary btn--full-width"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        ✉️ Send Email
                                    </motion.a>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Proper Bottom Footer ── */}
                    <footer className="pi-footer">
                        <p>© {new Date().getFullYear()} {PERSONAL.name} · {PERSONAL.tagline}</p>
                    </footer>
                </div>
            </LazySection>
        </>
    )
}
