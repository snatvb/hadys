import { ECS } from '../../ecs'
import { core } from '../core'
import { Matter } from './dependencies'
import * as components from './components'

export class PhysicsSystem extends ECS.System('Hadys::PhysicsSystem') {
  _filters = {
    time: new ECS.Filter([
      new ECS.Includes([core.components.WorldTimeTag, core.components.Time]),
    ]),
    bodies: new ECS.FilterWithLifecycle([
      new ECS.Includes([components.Body, core.components.Transform]),
    ]),
  }

  constructor(private _engine: Matter.Engine) {
    super()

    this._filters.bodies.onAppeared = (entity, cc) => {
      const body = cc.get(components.Body)!.value
      const { position } = cc.get(core.components.Transform)!
      Matter.Body.setPosition(
        body,
        Matter.Vector.create(position.x, position.y),
      )
      Matter.World.add(this._engine.world, body)
    }

    this._filters.bodies.onDisappeared = (entity, cc) => {
      const body = cc.get(components.Body)!.value
      Matter.World.remove(this._engine.world, body)
    }
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
      Matter.Engine.update(this._engine, Math.min(time.delta, 66))
    }

    for (const filter of this._filters.bodies) {
      const body = filter.components.get(components.Body)!.value
      const transform = filter.components.get(core.components.Transform)!
      transform.position.set(body.position.x, body.position.y)
      transform.rotation.set(body.angle)
    }
  }
}
