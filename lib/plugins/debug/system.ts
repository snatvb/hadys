import { ECS } from '../../ecs'
import * as physics from '../physics'
import * as render from '../render'
import { Matter, PIXI } from './dependencies'

export class DebugSystem extends ECS.System('Hadys::DebugSystem') {
  _filters = {
    bodies: new ECS.Filter([new ECS.Includes([physics.components.Body])]),
  }

  _graphics = new PIXI.Graphics()

  constructor(private _engine: Matter.Engine, private _app: PIXI.Application) {
    super()
    _app.stage.addChild(this._graphics)
  }

  update() {
    const graphics = this._graphics
    graphics.clear()
    graphics.lineStyle(5, 0xffffff, 0.7)

    for (const filter of this._filters.bodies) {
      const { vertices } = filter.components.get(physics.components.Body)!.value
      graphics.moveTo(vertices[0].x, vertices[0].y)
      for (var i = 1; i < vertices.length; i += 1) {
        graphics.lineTo(vertices[i].x, vertices[i].y)
      }
    }
  }
}
