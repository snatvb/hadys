import Matter from 'matter-js'
import { Config } from './interfaces'
import { PhysicsSystem } from './system'

export const create = (config: Config) => {
  const engine = Matter.Engine.create(config.engine)
  return {
    systems: [new PhysicsSystem(engine)],
  }
}
