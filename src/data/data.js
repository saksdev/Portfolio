/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          PORTFOLIO DATA — ALL YOUR INFO IN ONE FILE         ║
 * ║                                                             ║
 * ║  Edit this single file to update your entire portfolio.     ║
 * ║  Leave any array empty [] or value as '' to hide that       ║
 * ║  section / item automatically.                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────────────────────
// 0. CORE CONFIGURATION (Single Source of Truth)
//    Update these values to change them everywhere.
// ─────────────────────────────────────────────────────────────
export const CORE = {
    email: 'sakshams346@gmail.com',
    phone: '+91 8219205779',
    github: 'saksdev',
    linkedin: 'asakshamsharma',
    location: 'India',
}

// ─────────────────────────────────────────────────────────────
// 1. PERSONAL INFO
//    Used in: Hero, About, Navbar, Footer, Contact
// ─────────────────────────────────────────────────────────────
export const PERSONAL = {
    name: 'SAKSHAM SHARMA',
    shortName: 'Saksham',
    tagline: 'MERN & Frontend Developer | Software Engineer',

    bio: [
        "Full-Stack Developer (MERN) skilled in JavaScript, React.js, Node.js, and MongoDB, with hands-on experience building RESTful APIs and production-grade web applications.",
        "Strong foundation in secure authentication, responsive UI development, and scalable full-stack architecture.",
        "Passionate about building production-ready products, real-time web applications, and contributing to high-impact software solutions."
    ],

    details: [
        { label: '📧 Email', value: CORE.email },
        { label: '📱 Phone', value: CORE.phone },
        { label: '🏫 Degree', value: 'MCA' },
        { label: '📍 Location', value: CORE.location },
    ],

    chips: [
        { icon: '💻', text: 'Software Engineer' },
        { icon: '⚛️', text: 'Frontend & React' },
        { icon: '⚡', text: 'MERN Stack' },
    ],

    available: true,
    resumeUrl: '#',
}

// ─────────────────────────────────────────────────────────────
// 2. HERO SECTION
//    Typed subtitle roles + animated counter stats
// ─────────────────────────────────────────────────────────────
export const TYPED_ROLES = [
    'Software Engineer 💻',
    'MERN Stack Developer 🚀',
    'Frontend Developer ⚛️',
    'Full-Stack Developer 🧠',
]

export const HERO_STATS = [
    { target: 3, label: 'Featured Projects' },
    { target: 4, label: 'Certificates' },
    { target: 200, label: 'Problems Solved' },
]

// ─────────────────────────────────────────────────────────────
// 3. SOCIAL LINKS & CONTACT
//    Leave url/href as '' to hide that item
// ─────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = [
    { id: 'github', label: 'GitHub', emoji: '🐙', url: `https://github.com/${CORE.github}` },
    { id: 'linkedin', label: 'LinkedIn', emoji: '💼', url: `https://linkedin.com/in/${CORE.linkedin}` },
]

export const CONTACT_ITEMS = [
    { icon: '📧', label: 'Email', sub: CORE.email, href: `mailto:${CORE.email}` },
    { icon: '📱', label: 'Phone', sub: CORE.phone, href: `tel:${CORE.phone}` },
    { icon: '💼', label: 'LinkedIn', sub: 'LinkedIn Profile', href: `https://linkedin.com/in/${CORE.linkedin}` },
    { icon: '🐙', label: 'GitHub', sub: 'GitHub Profile', href: `https://github.com/${CORE.github}` },
]

// ─────────────────────────────────────────────────────────────
// 4. SKILLS
//    Empty array [] hides that tab. Remove an object to hide
//    that skill card.
// ─────────────────────────────────────────────────────────────
export const SKILLS = {
    languages: [
        { label: 'JavaScript', abbr: 'JS', accent: '#f7df1e' },
        { label: 'TypeScript', abbr: 'TS', accent: '#3178c6' },
        { label: 'C', abbr: 'C', accent: '#a8b9cc' },
        { label: 'Python', abbr: 'Py', accent: '#3776ab' },
        { label: 'C++', abbr: 'C++', accent: '#00599c' },
    ],
    web: [
        { label: 'React.js', abbr: 'Re', accent: '#61dafb' },
        { label: 'Node.js', abbr: 'Nd', accent: '#68a063' },
        { label: 'Express.js', abbr: 'Ex', accent: '#686868' },
        { label: 'HTML5', abbr: 'H5', accent: '#e34f26' },
        { label: 'CSS3', abbr: 'C3', accent: '#1572b6' },
        { label: 'Tailwind CSS', abbr: 'TW', accent: '#06b6d4' },
        { label: 'REST APIs', abbr: 'API', accent: '#00bcd4' },
    ],
    databases: [
        { label: 'MongoDB', abbr: 'Mg', accent: '#47a248' },
        { label: 'Mongoose', abbr: 'Ms', accent: '#880000' },
        { label: 'SQL', abbr: 'SQL', accent: '#e38c00' },
    ],
    tools: [
        { label: 'Git', abbr: 'Git', accent: '#f05032' },
        { label: 'GitHub', abbr: 'GH', accent: '#ffffff' },
        { label: 'Postman', abbr: 'Pm', accent: '#ff6c37' },
        { label: 'VS Code', abbr: 'VS', accent: '#007acc' },
        { label: 'Vercel', abbr: 'Vc', accent: '#000000' },
        { label: 'Netlify', abbr: 'Nf', accent: '#00c7b7' },
    ],
    aiTools: [
        { label: 'Antigravity', abbr: 'AG', accent: '#4285f4' },
        { label: 'ChatGPT', abbr: 'GPT', accent: '#10a37f' },
        { label: 'Cursor', abbr: 'Cu', accent: '#000000' },
        { label: 'Copilot', abbr: 'Cp', accent: '#6e40c9' },
        { label: 'Claude', abbr: 'Cl', accent: '#d97706' },
        { label: 'Qwen', abbr: 'Qw', accent: '#6366f1' },
    ],
}

// ─────────────────────────────────────────────────────────────
// 5. PROJECTS
//    cat: 'web' | 'ml' | 'mobile'  (filter categories)
// ─────────────────────────────────────────────────────────────
export const PROJECTS = [
    {
        id: 1, cat: 'web',
        index: '01',
        kind: 'Serverless Collaborative Editor',
        title: 'DocSync',
        tags: ['React.js', 'Next.js', 'TypeScript', 'TipTap', 'Yjs', 'WebRTC', 'Tailwind CSS'],
        desc: [
            'Built a serverless collaborative rich-text editor using Next.js, Yjs (CRDT), and WebRTC — zero backend required for real-time sync.',
            'Configured WebRTC signaling and peer-to-peer UDP channels, eliminating centralized database dependency for live edits.',
            'Supports concurrent multi-user editing with conflict-free document merging.',
        ],
        demoUrl: '#', codeUrl: `https://github.com/${CORE.github}/Real-Time-Collaboration`, liveUrl: '#',
    },
    {
        id: 2, cat: 'web',
        index: '02',
        kind: 'Full-stack RPG & Activity Tracker',
        title: 'Fitness Quest',
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST APIs'],
        desc: [
            'Built a full-stack fitness RPG with real-time activity tracking, XP progression, and leaderboard features.',
            'Integrated 3rd-party fitness APIs with MongoDB for persistent user progress and synchronization.',
            'Designed secure REST APIs for user data management with JWT auth and role-based access.',
        ],
        demoUrl: '#', codeUrl: `https://github.com/${CORE.github}/Fitness-Quest-RPG`, liveUrl: '#',
    },
    {
        id: 3, cat: 'web',
        index: '03',
        kind: 'MERN E-Commerce Platform',
        title: 'DigiMart',
        tags: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
        desc: [
            'Built a MERN e-commerce platform supporting secure digital product delivery.',
            'Developed 6+ REST APIs for user auth, product listing, and purchase flow using Node.js and Express.js.',
            'Achieved fully responsive UI using React.js, Vite, and Tailwind CSS across mobile and desktop.',
        ],
        demoUrl: '#', codeUrl: `https://github.com/${CORE.github}/DigiMart`, liveUrl: '#',
    },
]

export const PROJECT_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web' },
]

// ─────────────────────────────────────────────────────────────
// 6. CERTIFICATES
//    Empty array → section hidden. viewUrl: '' hides link.
// ─────────────────────────────────────────────────────────────
export const CERTIFICATES = [
    { abbr: 'SE', col: '#10b981', title: 'Software Engineer Intern', issuer: 'HackerRank', date: '2026', badge: '✅ Verified', gold: true, viewUrl: 'https://www.hackerrank.com/profile/SakshamSharmaDev' },
    { abbr: 'JS', col: '#f7df1e', title: 'JavaScript (Intermediate)', issuer: 'HackerRank', date: '2026', badge: '✅ Verified', gold: true, viewUrl: 'https://www.hackerrank.com/profile/SakshamSharmaDev' },
    { abbr: 'RE', col: '#61dafb', title: 'React (Basic)', issuer: 'HackerRank', date: '2025', badge: '✅ Verified', gold: true, viewUrl: 'https://www.hackerrank.com/profile/SakshamSharmaDev' },
    { abbr: 'PY', col: '#3776ab', title: 'Python (Basic)', issuer: 'HackerRank', date: '2023', badge: '✅ Verified', gold: true, viewUrl: 'https://www.hackerrank.com/profile/SakshamSharmaDev' },
    { abbr: 'SQ', col: '#e38c00', title: 'SQL (Basic)', issuer: 'HackerRank', date: '2026', badge: '✅ Verified', gold: true, viewUrl: 'https://www.hackerrank.com/profile/SakshamSharmaDev' },
]

// ─────────────────────────────────────────────────────────────
// 7. EDUCATION
//    Empty array → section hidden
// ─────────────────────────────────────────────────────────────
export const EDUCATION = [
    { degree: 'Master of Computer Applications (MCA)', institution: 'Himachal Pradesh University, Shimla', year: '2022 – 2024', grade: '7.4 CGPA', emoji: '🎓', description: '' },
    { degree: 'Bachelor of Computer Applications (BCA)', institution: 'Goswami Ganesh Dutt Sanatan Dharam College, Rajpur', year: '2018 – 2021', grade: '6.6 CGPA', emoji: '🎓', description: '' },
]

// ─────────────────────────────────────────────────────────────
// 8. EXPERIENCE
//    Empty array → section hidden
// ─────────────────────────────────────────────────────────────
export const EXPERIENCE = [
    {
        role: 'Full-Stack Development Intern (MERN Stack)',
        company: 'Hoping Minds – Katina Skills Pvt. Ltd.',
        location: 'Mohali, India',
        duration: 'Jan 2024 – Jul 2024',
        type: 'Internship',
        emoji: '💻',
        description: [
            'Architected scalable full-stack applications using MongoDB, Express.js, React.js, and Node.js.',
            'Designed and built RESTful APIs for secure client-server communication.',
            'Implemented JWT authentication and integrated frontend with backend services.',
            'Used Git/Github for version control, testing, debugging, and collaboration.',
        ],
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT', 'Git', 'GitHub'],
    },
]

// ─────────────────────────────────────────────────────────────
// 9. CODING PROFILES
//    Set username to '' to hide that platform card.
// ─────────────────────────────────────────────────────────────
export const USERNAMES = {
    github: CORE.github,
    leetcode: 'saksdev',
    codeforces: 'sakshams346',
    hackerrank: 'SakshamSharmaDev',
}

export const PLATFORMS = {
    github: { abbr: 'GH', name: 'GitHub', logoClass: 'gh', url: `https://github.com/${CORE.github}`, live: true },
    leetcode: { abbr: 'LC', name: 'LeetCode', logoClass: 'lc', url: `https://leetcode.com/${USERNAMES.leetcode}`, live: true },
    codeforces: { abbr: 'CF', name: 'Codeforces', logoClass: 'cf', url: `https://codeforces.com/profile/${USERNAMES.codeforces}`, live: true },
    hackerrank: { abbr: 'HR', name: 'HackerRank', logoClass: 'hr', url: `https://www.hackerrank.com/profile/${USERNAMES.hackerrank}`, live: false },
}
