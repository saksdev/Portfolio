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
    tagline: 'MERN Stack Developer & Problem Solver',

    bio: [
        "MERN stack developer with hands-on experience building full-stack web applications using React.js, Node.js, Express.js, and MongoDB.",
        "Skilled in developing responsive interfaces, REST APIs, authentication systems, and database integration.",
        "Passionate about problem-solving, learning new technologies, and contributing to scalable software solutions."
    ],

    details: [
        { label: '📧 Email', value: CORE.email },
        { label: '📱 Phone', value: CORE.phone },
        { label: '🏫 Degree', value: 'MCA' },
        { label: '📍 Location', value: CORE.location },
    ],

    chips: [
        { icon: '⚡', text: 'Full Stack Dev' },
        { icon: '🧠', text: 'Problem Solver' },
        { icon: '🤖', text: 'MERN Stack' },
    ],

    available: true,
    resumeUrl: '#',
}

// ─────────────────────────────────────────────────────────────
// 2. HERO SECTION
//    Typed subtitle roles + animated counter stats
// ─────────────────────────────────────────────────────────────
export const TYPED_ROLES = [
    'Frontend Developer 🚀',
    'MERN Stack Developer 💻',
    'Full Stack Developer 🧠',
    'Problem Solver 🤝',
]

export const HERO_STATS = [
    { target: 10, label: 'Projects' },
    { target: 200, label: 'Problems Solved' },
    { target: 3, label: 'Certifications' },
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
        { label: 'Python', abbr: 'Py', accent: '#3776ab' },
        { label: 'C', abbr: 'C', accent: '#a8b9cc' },
        { label: 'C++', abbr: 'C++', accent: '#00599c' },
    ],
    web: [
        { label: 'React.js', abbr: 'Re', accent: '#61dafb' },
        { label: 'Node.js', abbr: 'Nd', accent: '#68a063' },
        { label: 'Express.js', abbr: 'Ex', accent: '#686868' },
        { label: 'HTML5', abbr: 'H5', accent: '#e34f26' },
        { label: 'CSS3', abbr: 'C3', accent: '#1572b6' },
        { label: 'Tailwind CSS', abbr: 'TW', accent: '#06b6d4' },
        { label: 'REST API', abbr: 'API', accent: '#00bcd4' },
        { label: 'JWT', abbr: 'JWT', accent: '#d63384' },
    ],
    databases: [
        { label: 'MongoDB', abbr: 'Mg', accent: '#47a248' },
        { label: 'Mongoose', abbr: 'Ms', accent: '#880000' },
        { label: 'SQL (Basic)', abbr: 'SQ', accent: '#e38c00' },
    ],
    tools: [
        { label: 'Git', abbr: 'Git', accent: '#f05032' },
        { label: 'GitHub', abbr: 'GH', accent: '#ffffff' },
        { label: 'Postman', abbr: 'Pm', accent: '#ff6c37' },
        { label: 'VS Code', abbr: 'VS', accent: '#007acc' },
    ],
}

// ─────────────────────────────────────────────────────────────
// 5. PROJECTS
//    cat: 'web' | 'ml' | 'mobile'  (filter categories)
//    bg: CSS gradient for project thumbnail
// ─────────────────────────────────────────────────────────────
export const PROJECTS = [
    {
        id: 1, cat: 'web',
        index: '01',
        kind: 'Full-stack product',
        title: 'Fitness Quest',
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
        desc: 'A fitness tracker that plays like an RPG. Real-world workouts become quests, XP, and progress — with a responsive client and JWT-secured APIs behind it.',
        demoUrl: '#', codeUrl: `https://github.com/${CORE.github}`, liveUrl: '#',
    },
    {
        id: 2, cat: 'web',
        index: '02',
        kind: 'Commerce platform',
        title: 'DigiMart',
        tags: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
        desc: 'An e-commerce stack for digital goods: catalog, orders, users, and secure downloads — wired through REST APIs and MongoDB.',
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
    { abbr: 'JS', col: '#f7df1e', title: 'JavaScript (Basic)', issuer: 'HackerRank', date: '2024', badge: '✅ Verified', gold: true, viewUrl: '#' },
    { abbr: 'PY', col: '#3776ab', title: 'Python (Basic)', issuer: 'HackerRank', date: '2024', badge: '✅ Verified', gold: true, viewUrl: '#' },
    { abbr: 'RE', col: '#61dafb', title: 'React (Basic)', issuer: 'HackerRank', date: '2024', badge: '✅ Verified', gold: true, viewUrl: '#' },
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
        role: 'Full-Stack Developer Intern (MERN Stack)', company: 'Katina Skills Pvt. Ltd',
        duration: '01/2024 - 07/2024', type: 'Internship', emoji: '💻',
        description: [
            'Developed scalable full-stack applications using MongoDB, Express.js, React.js, and Node.js.',
            'Built RESTful APIs and integrated frontend with backend services.',
            'Implemented JWT authentication and secure user authorization.',
            'Created responsive and reusable UI components using React.js.',
            'Used Git for version control, testing, debugging, and collaboration.',
        ],
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Git'],
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
    hackerrank: 'sakshams346',
}

export const PLATFORMS = {
    github: { abbr: 'GH', name: 'GitHub', logoClass: 'gh', url: `https://github.com/${CORE.github}`, live: true },
    leetcode: { abbr: 'LC', name: 'LeetCode', logoClass: 'lc', url: `https://leetcode.com/${USERNAMES.leetcode}`, live: true },
    codeforces: { abbr: 'CF', name: 'Codeforces', logoClass: 'cf', url: `https://codeforces.com/profile/${USERNAMES.codeforces}`, live: true },
    hackerrank: { abbr: 'HR', name: 'HackerRank', logoClass: 'hr', url: `https://hackerrank.com/${USERNAMES.hackerrank}`, live: false },
}
