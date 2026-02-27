import { useState, useEffect } from 'react'

/**
 * useCodeforces
 * Fetches public Codeforces stats using the official API.
 * No authentication required for public handles.
 *
 * @param {string} handle – Codeforces handle (e.g. "tourist")
 * @returns {{ data, loading, error }}
 *   data: { name, rating, maxRating, rank, maxRank, contestCount, solvedCount }
 */
export default function useCodeforces(handle) {
    const [state, setState] = useState({ data: null, loading: true, error: null })

    useEffect(() => {
        if (!handle) return

        let cancelled = false

        async function fetchData() {
            try {
                setState(s => ({ ...s, loading: true, error: null }))

                // ── 1. User info + rating ─────────────────────────
                const [infoRes, ratingsRes, statusRes] = await Promise.all([
                    fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
                    fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
                    fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`),
                ])

                if (!infoRes.ok) throw new Error(`Codeforces: ${infoRes.status}`)

                const infoJson = await infoRes.json()
                const ratingsJson = ratingsRes.ok ? await ratingsRes.json() : { result: [] }
                const statusJson = statusRes.ok ? await statusRes.json() : { result: [] }

                if (infoJson.status !== 'OK') throw new Error(infoJson.comment || 'CF error')

                const user = infoJson.result[0]

                // Count unique solved problems from submissions
                const solved = new Set(
                    (statusJson.result || [])
                        .filter(s => s.verdict === 'OK')
                        .map(s => `${s.problem.contestId}-${s.problem.index}`)
                )

                if (cancelled) return

                setState({
                    data: {
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.handle,
                        rating: user.rating ?? 0,
                        maxRating: user.maxRating ?? 0,
                        rank: user.rank ?? 'unrated',
                        maxRank: user.maxRank ?? 'unrated',
                        contestCount: ratingsJson.result?.length ?? 0,
                        solvedCount: solved.size,
                        avatar: user.avatar,
                        profileUrl: `https://codeforces.com/profile/${handle}`,
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
    }, [handle])

    return state
}
