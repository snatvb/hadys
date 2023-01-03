import { hadys } from '../../lib/main'
import { MovableTag } from './components'

export class SimpleMoveSystem extends hadys.ECS.System('SimpleMoveSystem') {
  _filters = {
    transforms: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.core.components.Transform, MovableTag]),
    ]),
  }

  update() {
    for (const filter of this._filters.transforms) {
      const { position } = filter.components.get(
        hadys.core.components.Transform,
      )!
      if (position.x === 0) {
        continue
      }
      position.set((position.x + 2) % 100, (position.y + 2) % 100)
    }
  }
}
