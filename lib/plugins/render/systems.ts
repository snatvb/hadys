import { Sprite } from 'pixi.js'
import { ECS } from '../../ecs'
import { core } from '../core'
import * as components from './components'
import { RenderApp } from './interfaces'

export class SyncContainerSystem extends ECS.System(
  Symbol('Hadys::ResourceSystem'),
) {
  _filters = {
    sprites: new ECS.FilterWithLifecycle([
      new ECS.Includes([
        components.Sprites,
        components.Container,
        core.components.Transform,
      ]),
    ]),
  }

  constructor(private _app: RenderApp) {
    super()

    this._filters.sprites.onAppeared = (_, cc) => {
      const { sprites } = cc.get(components.Sprites<Record<string, Sprite>>)!
      const { container } = cc.get(components.Container)!

      for (const sprite of Object.values(sprites)) {
        container.addChild(sprite)
      }

      this._app.pixi.stage.addChild(container)
    }

    this._filters.sprites.onDisappeared = (_, cc) => {
      const { container } = cc.get(components.Container)!

      this._app.pixi.stage.removeChild(container)
    }
  }

  update() {
    for (const item of this._filters.sprites) {
      const transform = item.components.get(core.components.Transform)!
      if (transform.dirty) {
        const { container } = item.components.get(components.Container)!
        container.position.set(transform.x, transform.y)
      }
    }
  }
}
