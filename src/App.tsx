import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { startGame } from './game'
import { run } from './benchmark'

function useForceRerender() {
  const [_, set] = useState(false)
  return useCallback(() => set((v) => !v), [])
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const forceRerender = useForceRerender()

  // useEffect(() => {
  //   return run()
  // }, [])

  useEffect(() => {
    const api = startGame(containerRef.current!)
    return () => {
      api.clear()
    }
  })

  return (
    <div className="App">
      <button
        onClick={forceRerender}
        style={{ position: 'absolute', top: 10, left: 10 }}
      >
        Rerun
      </button>
      <div
        ref={containerRef}
        style={{
          width: '800px',
          height: '600px',
        }}
      />
    </div>
  )
}

export default App
