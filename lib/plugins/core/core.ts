import { IWorld } from '../../ecs/IWorld'
import { DirtiesExtension } from './extensions/dirties'
import { OneFramesExtension } from './extensions/one-frames'
import { HierarchyRemoveSystem, TimeSystem } from './systems'

import * as components from './components'
import * as geometry from './geometry'

export { components, geometry }

export const create = () => {
  return {
    systems: [new TimeSystem(), new HierarchyRemoveSystem()],
    extensions: [new DirtiesExtension(), new OneFramesExtension()],
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
