import Matter from 'matter-js'
import { ECS } from '../../../ecs'

export class PhysicsEngineExtension
  extends ECS.Extension
  implements ECS.IExtension
{
  constructor(public engine: Matter.Engine) {
    super()
  }

  destroy() {
    Matter.Engine.clear(this.engine)
    Matter.World.clear(this.engine.world, false)
  }
}
