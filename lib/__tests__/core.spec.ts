import { ECS } from '../ecs'
import { plugins } from '../engine'

describe('Filters', () => {
  it('Hierarchy remove', () => {
    const world = new ECS.World()
    const corePlugin = plugins.core.create()
    world.setExtensions([...corePlugin.extensions])
    world.setSystems([...corePlugin.systems])
    plugins.core.entities.time(world)

    const rootEntity = world.addEntity()
    const baseEntity = world.addEntity()
    const childEntity = world.addEntity()
    const child2Entity = world.addEntity()

    world.addComponent(rootEntity, new plugins.core.components.Hierarchy())

    world.addComponent(
      baseEntity,
      new plugins.core.components.Hierarchy(rootEntity),
    )

    world.addComponent(
      childEntity,
      new plugins.core.components.Hierarchy(baseEntity),
    )

    world.addComponent(
      child2Entity,
      new plugins.core.components.Hierarchy(baseEntity),
    )

    expect(world.entitiesCount).toBe(5)

    world.update()

    const rootHierarchy = world
      .getComponents(rootEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(rootHierarchy.children.size).toBe(1)

    const baseHierarchy = world
      .getComponents(baseEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(baseHierarchy.children.size).toBe(2)
    expect(baseHierarchy.parent).toBe(rootEntity)

    const childHierarchy = world
      .getComponents(childEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(childHierarchy.children.size).toBe(0)
    expect(childHierarchy.parent).toBe(baseEntity)

    world.removeEntity(baseEntity)
    world.update()

    expect(rootHierarchy.children.size).toBe(0)
    expect(world.entitiesCount).toBe(2)
  })

  it('Hierarchy break connection', () => {
    const world = new ECS.World()
    const corePlugin = plugins.core.create()
    world.setExtensions([...corePlugin.extensions])
    world.setSystems([...corePlugin.systems])
    plugins.core.entities.time(world)

    const rootEntity = world.addEntity()
    const baseEntity = world.addEntity()
    const childEntity = world.addEntity()

    world.addComponent(rootEntity, new plugins.core.components.Hierarchy())

    world.addComponent(
      baseEntity,
      new plugins.core.components.Hierarchy(rootEntity),
    )

    world.addComponent(
      childEntity,
      new plugins.core.components.Hierarchy(baseEntity),
    )

    expect(world.entitiesCount).toBe(4)

    world.update()

    const rootHierarchy = world
      .getComponents(rootEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(rootHierarchy.children.size).toBe(1)

    const baseHierarchy = world
      .getComponents(baseEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(baseHierarchy.children.size).toBe(1)
    expect(baseHierarchy.parent).toBe(rootEntity)

    const childHierarchy = world
      .getComponents(childEntity)!
      .get(plugins.core.components.Hierarchy)
    expect(childHierarchy.children.size).toBe(0)
    expect(childHierarchy.parent).toBe(baseEntity)

    world.removeComponent(baseEntity, plugins.core.components.Hierarchy)
    world.removeEntity(baseEntity)
    world.update()

    expect(rootHierarchy.children.size).toBe(0)
    expect(world.entitiesCount).toBe(3)
    expect(childHierarchy.parent).toBe(null)
  })
})
