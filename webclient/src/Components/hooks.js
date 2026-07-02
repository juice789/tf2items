import { useRef, useState, useCallback, useEffect } from 'react'

const useEventListener = (eventName, handler, element = window) => {
    const savedHandler = useRef()

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const isSupported = element && element.addEventListener
        if (!isSupported) return

        const eventListener = (event) => savedHandler.current(event)
        element.addEventListener(eventName, eventListener)

        return () => {
            element.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}

export const useMenuToggle = () => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef()

    const toggleOpen = useCallback((val) => {
        setIsOpen(typeof val === 'boolean' ? val : prev => !prev)
    }, [])

    const handleOutsideClick = useCallback((e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setIsOpen(false)
        }
    }, [])

    const onClick = useCallback((e) => {
        if (ref.current && (ref.current === e.target || ref.current.contains(e.target))) {
            toggleOpen()
        }
    }, [toggleOpen])

    useEventListener('mousedown', handleOutsideClick)

    return { ref, isOpen, toggleOpen, onClick }
}
