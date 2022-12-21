import { ECS } from '../../ecs'
import { PIXI } from './dependencies'

export class RenderExtension extends ECS.Extension implements ECS.IExtension {
  constructor(public app: PIXI.Application) {
    super()
  }

  destroy() {
    this.app.destroy(true, true)
  }
}
