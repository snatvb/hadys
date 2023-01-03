import { hadys } from '../../lib/main'
import { TimeToRemove } from './components'
import { createContainer } from './index'

export class CollisionSystem extends hadys.ECS.System('CollisionSystem') {
  _filters = {
    bodies: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.plugins.physics.components.Body]),
    ]),
  }

  private _collisions!: hadys.plugins.physics.extensions.CollisionDetector

  init() {
    super.init()
    this._collisions = this.world.getExtension(
      hadys.plugins.physics.extensions.CollisionDetector,
    )
  }

  update() {
    for (const event of this._collisions.collisions.start) {
      const [a] = event.pairs
      const { vertex } = a.contacts[a.contacts.length - 1]
      this._createHit(vertex)
    }
  }

  private _createHit(position: { x: number; y: number }) {
    const entityContainer = createContainer(this.world, position)
    this.world.addComponent(entityContainer, new TimeToRemove(1000))

    const graphicEntity = this.world.addEntity()
    const graphics = new hadys.plugins.render.Graphics()
    graphics.beginFill(0xff0000)
    graphics.drawCircle(0, 0, 10)
    graphics.endFill()
    graphics.pivot.set(5, 5)
    this.world.addComponent(
      graphicEntity,
      new hadys.plugins.render.components.DisplayObject(graphics),
    )
    this.world.addComponent(
      graphicEntity,
      new hadys.core.components.Hierarchy(entityContainer),
    )
  }
}
