/**
 * Interactive Terminal — command processing
 */
import {
    PERSONAL, SKILLS, PROJECTS, EXPERIENCE, EDUCATION,
    CERTIFICATES, SOCIAL_LINKS, CONTACT_ITEMS, CORE, USERNAMES
} from './data/data.js'

export function createTerminal(containerEl, appRegistry, openWindowFn) {
    const output = containerEl.querySelector('#term-output')
    const input = containerEl.querySelector('#term-input')
    const history = []
    let historyIdx = 0

    // Focus on click anywhere in terminal
    containerEl.addEventListener('click', () => input?.focus())
    setTimeout(() => input?.focus(), 100)

    function addLine(html, cls = 'term__result') {
        const div = document.createElement('div')
        div.className = `term__line ${cls}`
        div.innerHTML = html
        output.appendChild(div)
        output.scrollTop = output.scrollHeight
    }

    function addLines(lines, cls) {
        lines.forEach(l => addLine(l, cls))
    }

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim()
            input.value = ''
            if (cmd) {
                history.push(cmd)
                historyIdx = history.length
                addLine(`<span class="term__prompt">saksham@portfolio:~$</span> ${escapeHtml(cmd)}`, 'term__cmd')
                execute(cmd)
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (historyIdx > 0) { historyIdx--; input.value = history[historyIdx] }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIdx < history.length - 1) { historyIdx++; input.value = history[historyIdx] }
            else { historyIdx = history.length; input.value = '' }
        } else if (e.key === 'Tab') {
            e.preventDefault()
            const partial = input.value.trim().toLowerCase()
            const match = COMMANDS.find(c => c.startsWith(partial))
            if (match) input.value = match
        }
    })

    const COMMANDS = [
        'help', 'about', 'skills', 'projects', 'experience', 'education',
        'certs', 'contact', 'social', 'open', 'ls', 'clear', 'whoami',
        'date', 'neofetch', 'echo', 'history', 'pwd', 'cat',
    ]

    function execute(raw) {
        const parts = raw.split(/\s+/)
        const cmd = parts[0].toLowerCase()
        const args = parts.slice(1)

        switch (cmd) {
            case 'help':
                addLine('Available commands:', 'term__info')
                addLines([
                    '  <span class="term__accent">about</span>       — Who am I',
                    '  <span class="term__accent">skills</span>      — Tech stack',
                    '  <span class="term__accent">projects</span>    — My projects',
                    '  <span class="term__accent">experience</span>  — Work experience',
                    '  <span class="term__accent">education</span>   — Education',
                    '  <span class="term__accent">certs</span>       — Certificates',
                    '  <span class="term__accent">contact</span>     — Contact info',
                    '  <span class="term__accent">social</span>      — Social links',
                    '  <span class="term__accent">open &lt;app&gt;</span>  — Open an app window',
                    '  <span class="term__accent">ls</span>          — List all apps',
                    '  <span class="term__accent">clear</span>       — Clear terminal',
                    '  <span class="term__accent">whoami</span>      — User info',
                    '  <span class="term__accent">neofetch</span>    — System info',
                    '  <span class="term__accent">date</span>        — Current date',
                    '  <span class="term__accent">echo &lt;msg&gt;</span> — Echo text',
                    '  <span class="term__accent">history</span>     — Command history',
                ])
                break

            case 'about':
                addLine(`<span class="term__bold">${PERSONAL.name}</span>`, 'term__info')
                addLine(PERSONAL.tagline)
                addLine('')
                PERSONAL.bio?.forEach(p => addLine(p))
                break

            case 'skills': {
                const entries = Object.entries(SKILLS || {}).filter(([, a]) => a?.length)
                entries.forEach(([cat, items]) => {
                    addLine(`<span class="term__accent">${cat}:</span>`)
                    addLine('  ' + items.map(s => s.label).join(', '))
                })
                break
            }

            case 'projects':
                (PROJECTS || []).forEach(p => {
                    addLine(`<span class="term__info">${p.emoji} ${p.title}</span>`)
                    addLine(`  ${p.desc}`)
                    addLine(`  Tags: ${(p.tags || []).join(', ')}`)
                    const links = [
                        p.codeUrl && p.codeUrl !== '#' ? `<a href="${p.codeUrl}" target="_blank">Code</a>` : '',
                        p.liveUrl && p.liveUrl !== '#' ? `<a href="${p.liveUrl}" target="_blank">Live</a>` : '',
                        p.demoUrl && p.demoUrl !== '#' ? `<a href="${p.demoUrl}" target="_blank">Demo</a>` : '',
                    ].filter(Boolean).join('  ')
                    if (links) addLine(`  Links: ${links}`)
                    addLine('')
                })
                break

            case 'experience':
                (EXPERIENCE || []).forEach(exp => {
                    addLine(`<span class="term__info">${exp.emoji || '💼'} ${exp.role}</span>`)
                    addLine(`  ${exp.company} | ${exp.duration}`)
                    exp.description?.forEach(d => addLine(`  • ${d}`))
                    addLine('')
                })
                break

            case 'education':
                (EDUCATION || []).forEach(edu => {
                    addLine(`<span class="term__info">${edu.emoji || '🎓'} ${edu.degree}</span>`)
                    addLine(`  ${edu.institution} | ${edu.year}${edu.grade ? ' | ' + edu.grade : ''}`)
                })
                break

            case 'certs':
            case 'certificates':
                (CERTIFICATES || []).forEach(c => {
                    addLine(`<span class="term__info">[${c.abbr}] ${c.title}</span>`)
                    addLine(`  ${c.issuer} | ${c.date}`)
                })
                break

            case 'contact':
                (CONTACT_ITEMS || []).filter(c => c.href).forEach(c => {
                    addLine(`${c.icon} <span class="term__accent">${c.label}:</span> <a href="${c.href}" target="_blank">${c.sub}</a>`)
                })
                break

            case 'social':
                (SOCIAL_LINKS || []).filter(s => s.url).forEach(s => {
                    addLine(`${s.emoji} <span class="term__accent">${s.label}:</span> <a href="${s.url}" target="_blank">${s.url}</a>`)
                })
                break

            case 'open': {
                const appName = args[0]?.toLowerCase()
                if (!appName) { addLine('Usage: open <app_name>', 'term__error'); break }
                const app = appRegistry[appName]
                if (app) {
                    app.open()
                    addLine(`Opening ${app.title}...`, 'term__success')
                } else {
                    addLine(`App not found: ${appName}. Type 'ls' to see available apps.`, 'term__error')
                }
                break
            }

            case 'ls':
                addLine('Available apps:', 'term__info')
                Object.values(appRegistry).forEach(app => {
                    addLine(`  ${app.icon}  <span class="term__accent">${app.id}</span> — ${app.title}`)
                })
                break

            case 'clear':
                output.innerHTML = ''
                break

            case 'whoami':
                addLine(PERSONAL.name, 'term__info')
                addLine(PERSONAL.tagline)
                addLine(`Location: ${CORE.location}`)
                addLine(`Email: ${CORE.email}`)
                break

            case 'date':
                addLine(new Date().toString(), 'term__info')
                break

            case 'neofetch':
                addLine(`<div class="term__neofetch">
                    <pre class="term__neofetch-art">  ███████╗
  ██╔════╝
  ███████╗
  ╚════██║
  ███████║
  ╚══════╝</pre>
                    <div class="term__neofetch-info">
<span class="term__neofetch-label">saksham</span>@<span class="term__neofetch-label">portfolio</span>
─────────────────
<span class="term__neofetch-label">OS:</span> PortfolioOS v2.0
<span class="term__neofetch-label">Host:</span> ${PERSONAL.name}
<span class="term__neofetch-label">Kernel:</span> ${PERSONAL.tagline}
<span class="term__neofetch-label">Shell:</span> terminal.js
<span class="term__neofetch-label">Packages:</span> ${Object.values(SKILLS).flat().length} (skills)
<span class="term__neofetch-label">Theme:</span> Dark [macOS]
<span class="term__neofetch-label">Terminal:</span> PortfolioTerm
<span class="term__neofetch-label">CPU:</span> Full Stack Developer
<span class="term__neofetch-label">Memory:</span> ${EDUCATION[0]?.degree || 'N/A'}
                    </div>
                </div>`)
                break

            case 'echo':
                addLine(escapeHtml(args.join(' ')))
                break

            case 'history':
                history.forEach((h, i) => addLine(`  ${i + 1}  ${escapeHtml(h)}`))
                break

            case 'pwd':
                addLine('/home/saksham/portfolio')
                break

            case 'cat':
                if (args[0] === '/etc/skills' || args[0] === 'skills.txt') {
                    execute('skills')
                } else if (args[0] === 'resume' || args[0] === 'resume.txt') {
                    execute('about')
                } else {
                    addLine(`cat: ${args[0] || ''}: No such file or directory`, 'term__error')
                }
                break

            case 'sudo':
                if (args.join(' ').toLowerCase() === 'hire me') {
                    addLine('✅ Request submitted successfully!', 'term__success')
                    addLine('📧 Sending your offer letter to ' + CORE.email + '...', 'term__success')
                } else {
                    addLine(`sudo: command not found: ${args.join(' ')}`, 'term__error')
                }
                break

            case 'rm':
                if (args.join(' ').includes('-rf') && args.join(' ').includes('doubts')) {
                    addLine('🗑️  Removing all doubts...', 'term__success')
                    addLine('✅ Done! You should definitely hire me.', 'term__success')
                } else {
                    addLine('rm: operation not permitted', 'term__error')
                }
                break

            case 'exit':
                addLine('Cannot exit. This is your portfolio, you live here now.', 'term__info')
                break

            default:
                addLine(`command not found: ${escapeHtml(cmd)}. Type 'help' for commands.`, 'term__error')
        }

        addLine('') // blank line after output
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
