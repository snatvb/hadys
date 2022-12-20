import { ECS } from '../../ecs'
import { Matter } from './dependencies'

export class Body extends ECS.Component {
  constructor(public value: Matter.Body) {
    super()
  }
}
