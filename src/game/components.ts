import { hadys } from '../../lib/main'

export class FPSTag extends hadys.ECS.Component {}
export class MovableTag extends hadys.ECS.Component {}

export class TimeToRemove extends hadys.ECS.Component {
  public alive = 0
  constructor(public target: number) {
    super()
  }
}
