import { Sprite } from 'pixi.js'
import { ECS } from '../../ecs'
import * as components from './components'

export class SyncContainerSystem extends ECS.System(
  Symbol('Hadys::ResourceSystem'),
) {
  _filters = {
    sprites: new ECS.FilterWithLifecycle([
      new ECS.Includes([components.Sprites, components.Container]),
    ]),
  }

  constructor() {
    super()

    this._filters.sprites.onAppeared = (_, cc) => {
      const { sprites } = cc.get(components.Sprites<Record<string, Sprite>>)!
      const { container } = cc.get(components.Container)!

      for (const sprite of Object.values(sprites)) {
        container.addChild(sprite)
      }
    }

    this._filters.sprites.onDisappeared = (_, cc) => {
      const { sprites } = cc.get(components.Sprites<Record<string, Sprite>>)!
      const { container } = cc.get(components.Container)!

      for (const sprite of Object.values(sprites)) {
        container.removeChild(sprite)
      }
    }
  }

  update() {}
}
