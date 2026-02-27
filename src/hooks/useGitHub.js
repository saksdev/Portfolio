import { useState, useEffect } from 'react'

/**
 * useGitHub
 * Fetches public GitHub profile stats using the official REST API.
 * No authentication required for public profiles.
 *
 * @param {string} username – GitHub username (e.g. "octocat")
 * @returns {{ data, loading, error }}
 *   data: { repos, stars, followers, following, avatar, bio, name }
 */
export default function useGitHub(username) {
    const [state, setState] = useState({ data: null, loading: true, error: null })

    useEffect(() => {
        if (!username) return

        let cancelled = false

        async function fetchData() {
            try {
                setState(s => ({ ...s, loading: true, error: null }))

                // ── 1. Basic profile ──────────────────────────────
                const profileRes = await fetch(
                    `https://api.github.com/users/${username}`,
                    { headers: { Accept: 'application/vnd.github.v3+json' } }
                )
                if (!profileRes.ok) throw new Error(`GitHub: ${profileRes.status}`)
                const profile = await profileRes.json()

                // ── 2. All repos (to count total stars) ──────────
                const reposRes = await fetch(
                    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
                    { headers: { Accept: 'application/vnd.github.v3+json' } }
                )
                const repos = reposRes.ok ? await reposRes.json() : []

                const totalStars = Array.isArray(repos)
                    ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
                    : 0

                if (cancelled) return

                setState({
                    data: {
                        name: profile.name || profile.login,
                        avatar: profile.avatar_url,
                        bio: profile.bio,
                        repos: profile.public_repos,
                        followers: profile.followers,
                        following: profile.following,
                        stars: totalStars,
                        profileUrl: profile.html_url,
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
