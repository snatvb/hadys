import { Sprite } from 'pixi.js'
import { ECS } from '../../ecs'
import { ContainerComponent, SpritesComponent } from './components'

export class SyncContainerSystem extends ECS.System(
  Symbol('Hadys::ResourceSystem'),
) {
  _filters = {
    sprites: new ECS.FilterWithLifecycle([
      new ECS.Includes([SpritesComponent, ContainerComponent]),
    ]),
  }

  constructor() {
    super()

    this._filters.sprites.onAppeared = (_, components) => {
      const { sprites } = components.get(
        SpritesComponent<Record<string, Sprite>>,
      )!
      const container = components.get(ContainerComponent)!.container

      for (const sprite of Object.values(sprites)) {
        container.addChild(sprite)
      }
    }

    this._filters.sprites.onDisappeared = (_, components) => {
      const { sprites } = components.get(
        SpritesComponent<Record<string, Sprite>>,
      )!
      const container = components.get(ContainerComponent)!.container

      for (const sprite of Object.values(sprites)) {
        container.removeChild(sprite)
      }
    }
  }

  update() {}
}
