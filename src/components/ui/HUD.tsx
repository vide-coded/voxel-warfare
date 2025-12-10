import { useEffect } from 'react'
import { usePlayerStore } from '../../stores/playerStore'

export function HUD() {
  const { health, maxHealth, stamina, maxStamina, isSprinting, currentWeapon, isReloading } =
    usePlayerStore()

  const healthPercent = (health / maxHealth) * 100
  const staminaPercent = (stamina / maxStamina) * 100

  // Debug: Log when HUD mounts and weapon changes
  useEffect(() => {
    console.log('🎯 HUD mounted, current weapon:', currentWeapon?.name || 'none')
  }, [currentWeapon?.name])

  useEffect(() => {
    console.log('🔄 Weapon changed to:', currentWeapon?.name || 'none')
  }, [currentWeapon?.name])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      {/* Top-left: Health and Stamina bars */}
      <div className="absolute top-6 left-6 space-y-3 pointer-events-none">
        {/* Health bar */}
        <div className="w-64">
          <div className="flex justify-between text-sm font-medium text-white mb-1 drop-shadow-lg">
            <span>Health</span>
            <span>
              {Math.round(health)}/{maxHealth}
            </span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-linear-to-r from-red-600 to-red-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* Stamina bar */}
        <div className="w-64">
          <div className="flex justify-between text-sm font-medium text-white mb-1 drop-shadow-lg">
            <span>
              Stamina {isSprinting && <span className="text-yellow-400">(Sprinting)</span>}
            </span>
            <span>
              {Math.round(stamina)}/{maxStamina}
            </span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/20">
            <div
              className={`h-full transition-all duration-300 ${
                stamina < 20
                  ? 'bg-linear-to-r from-yellow-600 to-yellow-500'
                  : 'bg-linear-to-r from-green-600 to-green-500'
              }`}
              style={{ width: `${staminaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center: Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-8 h-8">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/80 -translate-y-1/2 drop-shadow-lg">
            <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-transparent border border-white/80 -translate-x-1/2 -translate-y-1/2" />
          </div>
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/80 -translate-x-1/2 drop-shadow-lg" />
        </div>
      </div>

      {/* Bottom-right: Weapon info & Controls */}
      <div className="absolute bottom-6 right-6 space-y-4 pointer-events-none">
        {/* Weapon display */}
        {currentWeapon && (
          <div className="text-white text-right bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
            <div className="text-2xl font-bold mb-2 drop-shadow-lg">{currentWeapon.name}</div>

            {currentWeapon.type === 'ranged' && (
              <div className="text-3xl font-mono drop-shadow-lg">
                {isReloading ? (
                  <span className="text-yellow-400 animate-pulse">Reloading...</span>
                ) : (
                  <>
                    <span className="text-white">{currentWeapon.ammo}</span>
                    <span className="text-white/40"> / </span>
                    <span className="text-white/60">{currentWeapon.totalAmmo}</span>
                  </>
                )}
              </div>
            )}

            {currentWeapon.type === 'melee' && (
              <div className="text-sm text-white/80 drop-shadow-lg">
                <p>Damage: {currentWeapon.damage}</p>
                <p>Stamina: {currentWeapon.staminaCost} per swing</p>
              </div>
            )}
          </div>
        )}

        {/* Controls hint */}
        <div className="text-white/80 text-sm space-y-1 text-right bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-lg">
          <p>
            <span className="text-white font-medium">1-2</span> - Switch weapon
          </p>
          <p>
            <span className="text-white font-medium">Left Click</span> - Attack
          </p>
          {currentWeapon?.type === 'ranged' && (
            <p>
              <span className="text-white font-medium">R</span> - Reload
            </p>
          )}
          <p>
            <span className="text-white font-medium">ZQSD</span> - Move
          </p>
          <p>
            <span className="text-white font-medium">Shift</span> - Sprint
          </p>
          <p>
            <span className="text-white font-medium">Space</span> - Jump
          </p>
          <p>
            <span className="text-white font-medium">ESC</span> - Unlock cursor
          </p>
        </div>
      </div>
    </div>
  )
}
