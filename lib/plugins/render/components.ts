import * as PIXI from 'pixi.js'
import { ECS } from '../../ecs'
import { HadysContext } from '../../shared-interfaces'

export type Resource = {
  name: string
  path: string
}

export class SpritesComponent<
  T extends Record<string, PIXI.Sprite> = Record<string, PIXI.Sprite>,
> extends ECS.Component {
  constructor(public sprites: T) {
    super()
  }
}

export class ContainerComponent extends ECS.Component {
  constructor(public container: PIXI.Container) {
    super()
  }
}
