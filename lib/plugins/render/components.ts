import * as PIXI from 'pixi.js'
import { ECS } from '../../ecs'

export type Resource = {
  name: string
  path: string
}

export class Sprites<
  T extends Record<string, PIXI.Sprite> = Record<string, PIXI.Sprite>,
> extends ECS.Component {
  constructor(public sprites: T) {
    super()
  }
}

export class Container extends ECS.Component {
  constructor(public container: PIXI.Container) {
    super()
  }
}
