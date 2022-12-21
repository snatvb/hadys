import { Matter, PIXI } from './dependencies'
import { DebugSystem } from './system'

export const create = (engine: Matter.Engine, app: PIXI.Application) => {
  return {
    systems: [new DebugSystem(engine, app)],
  }
}
