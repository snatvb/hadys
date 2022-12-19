import { IWorld } from '../../ecs/IWorld'
import { DirtiesExtension } from './extensions/dirties'
import { System } from './systems'

export * as components from './components'

export const create = (world: IWorld) => {
  return {
    systems: [],
    extensions: [new DirtiesExtension(world)],
  }
}
