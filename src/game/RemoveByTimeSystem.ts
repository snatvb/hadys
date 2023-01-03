import { hadys } from '../../lib/main'
import { TimeToRemove } from './components'
import { readWorldTime, worldTimeFilter } from './world-time'

export class RemoveByTimeSystem extends hadys.ECS.System('RemoveByTimeSystem') {
  _filters = {
    worldTime: worldTimeFilter,
    timeToRemove: new hadys.ECS.Filter([
      new hadys.ECS.Includes([TimeToRemove]),
    ]),
  }

  update() {
    const worldTime = readWorldTime(this._filters.worldTime)
    for (const filter of this._filters.timeToRemove) {
      const timeToRemove = filter.components.get(TimeToRemove)!
      timeToRemove.alive += worldTime.delta
      if (timeToRemove.alive > timeToRemove.target) {
        this.world.removeEntity(filter.entity)
      }
    }
  }
}
