import Matter from 'matter-js'
import { Config } from './interfaces'
import { PhysicsSystem } from './system'

export * as components from './components'

export const Body = Matter.Body
export const Bodies = Matter.Bodies

export const create = (config: Config) => {
  const engine = Matter.Engine.create(config.engine)
  return {
    systems: [new PhysicsSystem(engine)],
  }
}
