import { IWorld } from '../../ecs/IWorld'
import { DirtiesExtension } from './extensions/dirties'
import { OneFramesExtension } from './extensions/one-frames'
import { HierarchySystem, TimeSystem } from './systems'

import * as components from './components'
import * as geometry from './geometry'
import { HierarchyExtension } from './extensions/hirarchy'

export { components, geometry }

export const create = () => {
  return {
    systems: [new TimeSystem()],
    extensions: [
      new DirtiesExtension(),
      new OneFramesExtension(),
      new HierarchyExtension(),
    ],
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
