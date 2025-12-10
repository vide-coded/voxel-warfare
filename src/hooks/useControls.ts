import { useEffect, useState } from 'react'

interface KeyState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  sprint: boolean
  attack: boolean
  weaponSlot1: boolean
  weaponSlot2: boolean
  reload: boolean
}

export function useControls() {
  const [keys, setKeys] = useState<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    attack: false,
    weaponSlot1: false,
    weaponSlot2: false,
    reload: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key repeat events (when key is held down)
      if (e.repeat) return

      const key = e.key.toLowerCase()
      const code = e.code

      // Use e.code for number keys to avoid Shift modifier issues
      if (code === 'Digit1') {
        setKeys((prev) => ({ ...prev, weaponSlot1: true }))
        return
      }
      if (code === 'Digit2') {
        setKeys((prev) => ({ ...prev, weaponSlot2: true }))
        return
      }

      switch (key) {
        case 'z':
          setKeys((prev) => ({ ...prev, forward: true }))
          break
        case 's':
          setKeys((prev) => ({ ...prev, backward: true }))
          break
        case 'q':
          setKeys((prev) => ({ ...prev, left: true }))
          break
        case 'd':
          setKeys((prev) => ({ ...prev, right: true }))
          break
        case ' ':
          setKeys((prev) => ({ ...prev, jump: true }))
          break
        case 'shift':
          setKeys((prev) => ({ ...prev, sprint: true }))
          break
        case 'r':
          setKeys((prev) => ({ ...prev, reload: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const code = e.code

      // Use e.code for number keys to avoid Shift modifier issues
      if (code === 'Digit1') {
        setKeys((prev) => ({ ...prev, weaponSlot1: false }))
        return
      }
      if (code === 'Digit2') {
        setKeys((prev) => ({ ...prev, weaponSlot2: false }))
        return
      }

      switch (key) {
        case 'z':
          setKeys((prev) => ({ ...prev, forward: false }))
          break
        case 's':
          setKeys((prev) => ({ ...prev, backward: false }))
          break
        case 'q':
          setKeys((prev) => ({ ...prev, left: false }))
          break
        case 'd':
          setKeys((prev) => ({ ...prev, right: false }))
          break
        case ' ':
          setKeys((prev) => ({ ...prev, jump: false }))
          break
        case 'shift':
          setKeys((prev) => ({ ...prev, sprint: false }))
          break
        case 'r':
          setKeys((prev) => ({ ...prev, reload: false }))
          break
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Left click (button 0)
      if (e.button === 0) {
        setKeys((prev) => ({ ...prev, attack: true }))
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      // Left click (button 0)
      if (e.button === 0) {
        setKeys((prev) => ({ ...prev, attack: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return keys
}
