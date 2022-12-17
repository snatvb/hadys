import { ECS } from '../ecs'

class Position extends ECS.Component {
  public x: number = 0
  public y: number = 0
}

class Velocity extends ECS.Component {
  public x: number = 0
  public y: number = 0
}

describe('Leaks', () => {
  it('Added & Removed Fully', () => {
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.Filter([new ECS.Includes([Position])]),
      }

      constructor() {
        super()
      }

      update() {}
    }

    const world = new ECS.World()
    const system = new System()
    world.setSystems([system])
    const entity = world.addEntity()
    world.addComponent(entity, new Position())
    const entity2 = world.addEntity()
    world.addComponent(entity2, new Velocity())

    expect(world.entitiesCount).toBe(2)
    expect(system._filters.positions.entities.size).toBe(1)

    world.removeEntity(entity)
    world.update()
    expect(world.entitiesCount).toBe(1)
    expect(system._filters.positions.entities.size).toBe(0)
  })
})
