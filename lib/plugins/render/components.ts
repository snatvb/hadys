import { ECS } from '../../ecs'
import { PIXI } from './dependencies'

export type Resource = {
  name: string
  path: string
}

export class DisplayObject<T extends PIXI.DisplayObject> extends ECS.Component {
  constructor(public object: T) {
    super()
  }
}

export class Container extends ECS.Component {
  constructor(public container: PIXI.Container = new PIXI.Container()) {
    super()
  }
}
