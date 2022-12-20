import { BaseComponentClass, Component } from './component'
import { ComponentContainer } from './ComponentContainer'
import { IExtension } from './IExtension'
import { Entity, START_ENTITY_ID } from './entity'
import { sortSystems } from './helpers'
import { ISystem } from './ISystem'
import { IWorld } from './IWorld'

export class World implements IWorld {
  private _entities = new Map<Entity, ComponentContainer>()
  private _systems = new Set<ISystem>()
  private _extensions = new Set<IExtension>()

  private _nextEntityID = START_ENTITY_ID
  private _entitiesToDestroy: Entity[] = []

  get entitiesCount(): number {
    return this._entities.size
  }

  addEntity(): Entity {
    let entity = this._nextEntityID
    this._nextEntityID++
    this._entities.set(entity, new ComponentContainer())
    this._extensions.forEach((extension) => extension.addEntity(entity))
    return entity
  }

  removeEntity(entity: Entity): void {
    this._entitiesToDestroy.push(entity)
    this._extensions.forEach((extension) => extension.removeEntity(entity))
  }

  addComponent(entity: Entity, component: Component): void {
    this._entities.get(entity)!.add(component)
    this._extensions.forEach((extension) =>
      extension.addComponent(entity, component),
    )

    this._updateEntity(entity)
  }

  getComponents(entity: Entity) {
    return this._entities.get(entity)
  }

  removeComponent(entity: Entity, componentClass: BaseComponentClass): void {
    this._entities.get(entity)!.delete(componentClass)
    this._extensions.forEach((extension) =>
      extension.removeComponent(entity, componentClass),
    )
    this._updateEntity(entity)
  }

  setSystems(systems: ISystem[]): void {
    this._systems.clear()

    const sorted = sortSystems(systems)
    for (let system of sorted) {
      this._addSystem(system)
    }
  }

  setExtensions(extensions: IExtension[]): void {
    this._extensions = new Set(extensions)
  }

  addExtension(extension: IExtension): void {
    this._extensions.add(extension)
  }

  update(): void {
    this._extensions.forEach((extension) => extension.update())
    for (let system of this._systems) {
      system.update()
    }

    while (this._entitiesToDestroy.length > 0) {
      this._destroyEntity(this._entitiesToDestroy.pop()!)
    }
  }

  private _addSystem(system: ISystem): void {
    system.init()

    if (system.validate() == false) {
      return
    }

    system.world = this
    this._systems.add(system)

    for (let entity of this._entities.keys()) {
      this._updateSystems(entity, system)
    }
  }

  private _removeSystem(system: ISystem): void {
    this._systems.delete(system)
  }

  private _destroyEntity(entity: Entity): void {
    this._entities.delete(entity)
    for (let system of this._systems) {
      system.deleteEntity(entity)
    }
  }

  private _updateEntity(entity: Entity): void {
    for (let system of this._systems.keys()) {
      this._updateSystems(entity, system)
    }
  }

  private _updateSystems(entity: Entity, system: ISystem): void {
    let have = this._entities.get(entity)!
    system.updateEntity(entity, have)
  }
}
