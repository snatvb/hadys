import { useEffect, useRef } from 'react'
import './App.css'
import { run } from './game'
// import { run } from './benchmark'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return run(canvasRef.current!)
  }, [])

  return (
    <div className="App">
      <canvas ref={canvasRef} id="game" width="800" height="600" />
    </div>
  )
}

export default App
