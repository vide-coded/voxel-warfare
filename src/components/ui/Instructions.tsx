import { useEffect, useState } from 'react'

export function Instructions() {
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsLocked(document.pointerLockElement !== null)
    }

    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('pointerlockerror', () => {
      console.error('Pointer lock failed')
    })

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {!isLocked && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2rem 3rem',
            borderRadius: '12px',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 600 }}>
            🎮 Voxel Warfare
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', opacity: 0.9 }}>Click to play</p>
          <div
            style={{
              fontSize: '0.875rem',
              opacity: 0.7,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1rem',
              marginTop: '1rem',
            }}
          >
            <p style={{ margin: '0.25rem 0' }}>
              <strong>ESC</strong> - Exit pointer lock
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Mouse</strong> - Look around
            </p>
          </div>
        </div>
      )}

      {isLocked && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backdropFilter: 'blur(5px)',
          }}
        >
          Press <strong>ESC</strong> to unlock pointer
        </div>
      )}
    </div>
  )
}
