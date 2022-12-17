import { ECS } from '../ecs'

describe('Filters', () => {
  class Position extends ECS.Component {
    public x: number = 0
    public y: number = 0
  }

  it('Appeared', () => {
    const update = jest.fn()
    const appeared = jest.fn()
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.FilterWithLifecycle([new ECS.Includes([Position])]),
      }

      constructor() {
        super()
        this._filters.positions.onAppeared = appeared
      }

      update() {
        for (const _ of this._filters.positions) {
          update()
        }
      }
    }

    const world = new ECS.World()
    world.setSystems([new System()])
    const entity = world.addEntity()
    world.addComponent(entity, new Position())
    world.update()
    world.removeComponent(entity, Position)
    world.addComponent(entity, new Position())

    expect(update).toBeCalledTimes(1)
    expect(appeared).toBeCalledTimes(2)
  })

  it('Disappeared', () => {
    const update = jest.fn()
    const disappeared = jest.fn()
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.FilterWithLifecycle([new ECS.Includes([Position])]),
      }

      constructor() {
        super()
        this._filters.positions.onDisappeared = disappeared
      }

      update() {
        for (const _ of this._filters.positions) {
          update()
        }
      }
    }

    const world = new ECS.World()
    world.setSystems([new System()])
    const entity = world.addEntity()
    world.addComponent(entity, new Position())
    world.update()
    world.removeComponent(entity, Position)
    world.addComponent(entity, new Position())

    expect(update).toBeCalledTimes(1)
    expect(disappeared).toBeCalledTimes(1)
  })
})
