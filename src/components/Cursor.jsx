import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
    const [clicked, setClicked] = useState(false)
    const [hidden, setHidden] = useState(false)

    const mx = useMotionValue(-100)
    const my = useMotionValue(-100)

    const ringX = useSpring(mx, { stiffness: 520, damping: 42 })
    const ringY = useSpring(my, { stiffness: 520, damping: 42 })
    const dotX = useSpring(mx, { stiffness: 140, damping: 22 })
    const dotY = useSpring(my, { stiffness: 140, damping: 22 })

    useEffect(() => {
        const move = e => { mx.set(e.clientX); my.set(e.clientY) }
        const down = () => setClicked(true)
        const up = () => setClicked(false)
        const leave = () => setHidden(true)
        const enter = () => setHidden(false)

        window.addEventListener('mousemove', move)
        window.addEventListener('mousedown', down)
        window.addEventListener('mouseup', up)
        document.addEventListener('mouseleave', leave)
        document.addEventListener('mouseenter', enter)

        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mousedown', down)
            window.removeEventListener('mouseup', up)
            document.removeEventListener('mouseleave', leave)
            document.removeEventListener('mouseenter', enter)
        }
    }, [mx, my])

    /* Hide on touch devices */
    if (typeof window !== 'undefined' &&
        window.matchMedia('(pointer: coarse)').matches) return null

    return (
        <>
            <motion.div
                className={`cursor-ring ${clicked ? 'is-clicked' : ''} ${hidden ? 'is-hidden' : ''}`}
                style={{ left: ringX, top: ringY }}
            />
            <motion.div
                className="cursor-dot"
                style={{ left: dotX, top: dotY }}
            />
        </>
    )
}
