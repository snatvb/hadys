import { ECS } from '../../ecs'
import * as physics from '../physics'
import { core } from '../core'
import { Matter, PIXI } from './dependencies'

export class DebugSystem extends ECS.System('Hadys::DebugSystem') {
  _filters = {
    bodies: new ECS.Filter([new ECS.Includes([physics.components.Body])]),
    time: new ECS.Filter([
      new ECS.Includes([core.components.Time, core.components.WorldTimeTag]),
    ]),
  }

  _graphics = new PIXI.Graphics()

  constructor(private _engine: Matter.Engine, private _app: PIXI.Application) {
    super()
    this._graphics.zIndex = 1000
    _app.stage.addChild(this._graphics)
  }

  update() {
    const time = this._filters.time
      .first()!
      .components.get(core.components.Time)!
    if (time.ticks % 50 === 1) {
      this._app.stage.sortChildren()
    }

    const graphics = this._graphics
    graphics.clear()
    graphics.lineStyle(2, 0x00ff00, 1)

    for (const filter of this._filters.bodies) {
      const { vertices } = filter.components.get(physics.components.Body)!.value
      graphics.moveTo(vertices[0].x, vertices[0].y)
      for (var i = 1; i < vertices.length; i += 1) {
        graphics.lineTo(vertices[i].x, vertices[i].y)
      }
    }
  }
}
