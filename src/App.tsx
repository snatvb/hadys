import { useEffect, useRef } from 'react'
import './App.css'
import { run } from './game'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return run()
  }, [])

  return (
    <div className="App">
      <canvas id="game" width="800" height="600" />
    </div>
  )
}

export default App
