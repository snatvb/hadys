import { Matter } from './dependencies'
import { CollisionDetector } from './extensions/collision-detector'
import { PhysicsEngineExtension } from './extensions/engine'
import { Config } from './interfaces'
import { PhysicsSystem } from './system'

export * as components from './components'

export * as extensions from './extensions'

export const Body = Matter.Body
export const Bodies = Matter.Bodies

export const create = (config: Config = {}) => {
  const engine = Matter.Engine.create(config.engine)
  // const canvas = document.querySelector('canvas')!
  // const render = Matter.Render.create({
  //   engine,
  //   element: document.body,
  // })
  // render.canvas.style.position = 'absolute'
  // render.canvas.style.top = `${canvas.offsetTop}px`
  // render.canvas.style.left = `${canvas.offsetLeft}px`
  // render.canvas.style.opacity = '0.5'
  // Matter.Render.run(render)
  // render.canvas.style.background = 'transparent'
  return {
    engine,
    extensions: [
      new CollisionDetector(engine),
      new PhysicsEngineExtension(engine),
    ],
    systems: [new PhysicsSystem(engine)],
  }
}
