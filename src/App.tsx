import { useEffect, useRef } from 'react'
import './App.css'
import { startGame } from './game'
import { run } from './benchmark'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // useEffect(() => {
  //   return run()
  // }, [])

  useEffect(() => {
    return startGame(canvasRef.current!)
  }, [])

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        id="game"
        style={{
          width: '800px',
          height: '600px',
        }}
      />
    </div>
  )
}

export default App
