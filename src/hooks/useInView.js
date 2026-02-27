import { useEffect, useRef, useState } from 'react'

/**
 * useInView — returns [ref, hasBeenVisible]
 *
 * Once the element enters the viewport (even partially),
 * `hasBeenVisible` flips to true and stays true.
 * This means the component mounts once and never unmounts,
 * preserving state while skipping the initial render cost.
 *
 * @param {object} options - IntersectionObserver options
 * @param {string} options.rootMargin - preload distance (default: '200px')
 * @param {number} options.threshold - 0–1 (default: 0)
 */
export default function useInView({
    rootMargin = '200px',
    threshold = 0,
} = {}) {
    const ref = useRef(null)
    const [hasBeenVisible, setHasBeenVisible] = useState(false)

    useEffect(() => {
        if (hasBeenVisible) return // already revealed — no need to observe
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasBeenVisible(true)
                    observer.disconnect()   // stop watching once triggered
                }
            },
            { rootMargin, threshold }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasBeenVisible, rootMargin, threshold])

    return [ref, hasBeenVisible]
}
