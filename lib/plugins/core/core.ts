import { IWorld } from '../../ecs/IWorld'
import { DirtiesExtension } from './extensions/dirties'
import { OneFramesExtension } from './extensions/one-frames'
import { TimeSystem } from './systems'

import * as components from './components'
import * as geometry from './geometry'

export { components, geometry }

export const create = (world: IWorld) => {
  return {
    systems: [new TimeSystem()],
    extensions: [new DirtiesExtension(world), new OneFramesExtension(world)],
  }
}

export const entities = {
  time: (world: IWorld) => {
    const time = world.addEntity()
    world.addComponent(time, new components.Time())
    world.addComponent(time, new components.WorldTimeTag())
    return time
  },
}
