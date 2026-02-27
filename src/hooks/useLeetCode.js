import { useState, useEffect } from 'react'

/**
 * useLeetCode
 * Fetches LeetCode profile stats via the public alfa-leetcode-api proxy.
 * Source: https://github.com/alfaarghya/alfa-leetcode-api
 * Hosted proxy: https://alfa-leetcode-api.onrender.com
 *
 * Endpoints used:
 *   GET /{username}           – profile overview
 *   GET /{username}/solved    – solved breakdown by difficulty
 *
 * @param {string} username – LeetCode username
 * @returns {{ data, loading, error }}
 *   data: { totalSolved, easy, medium, hard, ranking, acceptanceRate, contributionPoints }
 */
export default function useLeetCode(username) {
    const [state, setState] = useState({ data: null, loading: true, error: null })

    useEffect(() => {
        if (!username) return

        let cancelled = false
        const BASE = 'https://alfa-leetcode-api.onrender.com'

        async function fetchData() {
            try {
                setState(s => ({ ...s, loading: true, error: null }))

                const [profileRes, solvedRes] = await Promise.all([
                    fetch(`${BASE}/${username}`),
                    fetch(`${BASE}/${username}/solved`),
                ])

                if (!profileRes.ok) throw new Error(`LeetCode API: ${profileRes.status}`)

                const profile = await profileRes.json()
                const solved = solvedRes.ok ? await solvedRes.json() : {}

                if (cancelled) return

                setState({
                    data: {
                        name: profile.name ?? username,
                        avatar: profile.avatar ?? null,
                        ranking: profile.ranking ?? 0,
                        totalSolved: solved.solvedProblem ?? 0,
                        easy: solved.easySolved ?? 0,
                        medium: solved.mediumSolved ?? 0,
                        hard: solved.hardSolved ?? 0,
                        contributionPoints: profile.contributionPoint ?? 0,
                        acceptanceRate: profile.acceptanceRate ?? 0,
                        profileUrl: `https://leetcode.com/${username}`,
                    },
                    loading: false,
                    error: null,
                })
            } catch (err) {
                if (!cancelled) setState({ data: null, loading: false, error: err.message })
            }
        }

        fetchData()
        return () => { cancelled = true }
    }, [username])

    return state
}
