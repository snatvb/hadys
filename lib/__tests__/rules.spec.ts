import { ECS } from '../ecs'

describe('Rules', () => {
  class Position extends ECS.Component {
    public x: number = 0
    public y: number = 0
  }

  class Velocity extends ECS.Component {
    public x: number = 0
    public y: number = 0
  }

  class AnyTag extends ECS.Component {}

  it('Include', () => {
    const fn = jest.fn()
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.Filter([new ECS.Includes([Position])]),
      }

      update() {
        for (const _ of this._filters.positions) {
          fn()
        }
      }
    }

    const world = new ECS.World()
    world.setSystems([new System()])
    const entity = world.addEntity()
    world.addComponent(entity, new Position())
    world.update()

    expect(fn).toBeCalledTimes(1)
  })

  it('Exclude', () => {
    const fn = jest.fn()
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.Filter([new ECS.Exclude([Velocity])]),
      }

      update() {
        for (const _ of this._filters.positions) {
          fn()
        }
      }
    }

    const world = new ECS.World()
    world.setSystems([new System()])

    const entity = world.addEntity()
    world.addComponent(entity, new Position())

    const entity2 = world.addEntity()
    world.addComponent(entity2, new Position())
    world.addComponent(entity2, new Velocity())

    const entity3 = world.addEntity()
    world.addComponent(entity3, new Velocity())

    const entity4 = world.addEntity()
    world.addComponent(entity4, new AnyTag())

    world.update()
    expect(fn).toBeCalledTimes(2)
  })

  it('Exclude & Include', () => {
    const fn = jest.fn()
    class System extends ECS.System(Symbol('test')) {
      _filters = {
        positions: new ECS.Filter([
          new ECS.Includes([Position]),
          new ECS.Exclude([Velocity]),
        ]),
      }

      update() {
        for (const _ of this._filters.positions) {
          fn()
        }
      }
    }

    const world = new ECS.World()
    world.setSystems([new System()])

    const entity = world.addEntity()
    world.addComponent(entity, new Position())

    const entity2 = world.addEntity()
    world.addComponent(entity2, new Position())
    world.addComponent(entity2, new Velocity())

    const entity3 = world.addEntity()
    world.addComponent(entity3, new AnyTag())

    world.update()
    expect(fn).toBeCalledTimes(1)
  })
})
