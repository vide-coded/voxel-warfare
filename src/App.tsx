import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { Camera } from './components/game/Camera'
import { Player } from './components/game/Player'
import { ProjectileManager } from './components/game/ProjectileManager'
import { Scene } from './components/game/Scene'
import { HUD } from './components/ui/HUD'
import { Instructions } from './components/ui/Instructions'
import { Ground } from './components/world/Ground'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{
          fov: 75,
          position: [0, 1.6, 0],
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        dpr={[1, 2]}
      >
        <Physics gravity={[0, -30, 0]} debug={false}>
          <Scene />
          <Player />
          <Ground />
          <ProjectileManager />
        </Physics>
        <Camera />
      </Canvas>
      <Instructions />
      <HUD />
    </div>
  )
}

export default App
