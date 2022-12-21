import Matter from 'matter-js'
import { ECS } from '../../../ecs'

export type Collisions = {
  start: Matter.IEventCollision<Matter.Engine>[]
  active: Matter.IEventCollision<Matter.Engine>[]
  end: Matter.IEventCollision<Matter.Engine>[]
}

export class CollisionDetector extends ECS.Extension implements ECS.IExtension {
  collisions: Collisions = {
    start: [],
    active: [],
    end: [],
  }

  constructor(private _engine: Matter.Engine) {
    super()

    Matter.Events.on(_engine, 'collisionStart', this._handleCollisionStart)
    Matter.Events.on(_engine, 'collisionActive', this._handleCollisionActive)
    Matter.Events.on(_engine, 'collisionEnd', this._handleCollisionEnd)
  }

  afterUpdate(): void {
    this.collisions.start = []
    this.collisions.active = []
    this.collisions.end = []
  }

  destroy(): void {
    Matter.Events.off(
      this._engine,
      'collisionStart',
      this._handleCollisionStart,
    )
    Matter.Events.off(
      this._engine,
      'collisionActive',
      this._handleCollisionActive,
    )
    Matter.Events.off(this._engine, 'collisionEnd', this._handleCollisionEnd)
  }

  private _handleCollisionStart = (
    event: Matter.IEventCollision<Matter.Engine>,
  ) => {
    this.collisions.start.push(event)
  }

  private _handleCollisionActive = (
    event: Matter.IEventCollision<Matter.Engine>,
  ) => {
    this.collisions.active.push(event)
  }

  private _handleCollisionEnd = (
    event: Matter.IEventCollision<Matter.Engine>,
  ) => {
    this.collisions.end.push(event)
  }
}
