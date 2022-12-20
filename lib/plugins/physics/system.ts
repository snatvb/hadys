import { ECS } from '../../ecs'
import { core } from '../core'
import { Matter } from './dependencies'

export class PhysicsSystem extends ECS.System('Hadys::PhysicsSystem') {
  _filters = {
    time: new ECS.Filter([
      new ECS.Includes([core.components.WorldTimeTag, core.components.Time]),
    ]),
  }

  constructor(private _engine: Matter.Engine) {
    super()
  }

  update() {
    if (process.env.NODE_ENV !== 'production') {
      const timesCount = this._filters.time.entities.size
      if (timesCount === 0) {
        return console.warn('No time component found')
      }
      if (timesCount > 1) {
        return console.warn('More than one time component found')
      }
    }

    for (const filter of this._filters.time) {
      const time = filter.components.get(core.components.Time)!
      Matter.Engine.update(this._engine, time.delta)
    }
  }
}
