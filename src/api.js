const GH = 'https://api.github.com'
const LC = 'https://alfa-leetcode-api.onrender.com'
const CF = 'https://codeforces.com/api'

export async function fetchGitHub(username) {
    if (!username) return null
    try {
        const [profileRes, reposRes] = await Promise.all([
            fetch(`${GH}/users/${username}`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
            fetch(`${GH}/users/${username}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
        ])
        if (!profileRes.ok) return null
        const profile = await profileRes.json()
        const repos = reposRes.ok ? await reposRes.json() : []
        const stars = Array.isArray(repos) ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0
        return { repos: profile.public_repos, followers: profile.followers, stars }
    } catch { return null }
}

export async function fetchLeetCode(username) {
    if (!username) return null
    try {
        const [profileRes, solvedRes] = await Promise.all([
            fetch(`${LC}/${username}`),
            fetch(`${LC}/${username}/solved`),
        ])
        if (!profileRes.ok) return null
        const profile = await profileRes.json()
        const solved = solvedRes.ok ? await solvedRes.json() : {}
        return {
            totalSolved: solved.solvedProblem ?? 0,
            ranking: profile.ranking ?? 0,
            acceptanceRate: profile.acceptanceRate ?? 0,
        }
    } catch { return null }
}

export async function fetchCodeforces(handle) {
    if (!handle) return null
    try {
        const [infoRes, statusRes] = await Promise.all([
            fetch(`${CF}/user.info?handles=${handle}`),
            fetch(`${CF}/user.status?handle=${handle}&from=1&count=1000`),
        ])
        if (!infoRes.ok) return null
        const info = await infoRes.json()
        if (info.status !== 'OK') return null
        const user = info.result[0]
        const statusJson = statusRes.ok ? await statusRes.json() : { result: [] }
        const solved = new Set(
            (statusJson.result || []).filter(s => s.verdict === 'OK').map(s => `${s.problem.contestId}-${s.problem.index}`)
        )
        return { rating: user.rating ?? 0, rank: user.rank ?? 'unrated', solvedCount: solved.size }
    } catch { return null }
}
