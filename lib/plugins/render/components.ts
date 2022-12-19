import { ECS } from '../../ecs'
import { PIXI } from './dependencies'

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
  constructor(public container: PIXI.Container = new PIXI.Container()) {
    super()
  }
}
