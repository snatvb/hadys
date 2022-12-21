import { ECS } from '../../ecs'
import { Time } from './components'

export class TimeSystem extends ECS.System('Hadys::TimeSystem') {
  _filters = {
    time: new ECS.Filter([new ECS.Has(Time)]),
  }

  update() {
    for (const filter of this._filters.time) {
      const time = filter.components.get(Time)!
      const now = performance.now()
      time.delta = now - time.lastUpdate
      time.elapsed += time.delta
      time.lastUpdate = now
      time.ticks += 1
    }
  }
}
