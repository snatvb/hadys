import { ECS } from '../../ecs'
import { PIXI } from './dependencies'

export type Resource = {
  name: string
  path: string
}

export class Sprite extends ECS.Component {
  constructor(public sprite: PIXI.Sprite) {
    super()
  }
}

export class Container extends ECS.Component {
  constructor(public container: PIXI.Container = new PIXI.Container()) {
    super()
  }
}
