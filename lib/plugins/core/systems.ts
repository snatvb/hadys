import { ECS } from '../../ecs'
import { Time, WorldTimeTag } from './components'

export class TimeSystem extends ECS.System('Hadys::TimeSystem') {
  _filters = {
    time: new ECS.Filter([new ECS.Has(Time)]),
    worldTime: new ECS.FilterWithLifecycle([
      new ECS.Includes([Time, WorldTimeTag]),
    ]),
  }

  constructor() {
    super()

    if (process.env.NODE_ENV !== 'production') {
      this._filters.worldTime.onAppeared = (entity, cc) => {
        const timesCount = this._filters.worldTime.entities.size
        if (timesCount === 0) {
          return console.warn('No time component found')
        }
        if (timesCount > 1) {
          return console.warn(
            'More than one time component with world tag found',
          )
        }
      }
    }
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
