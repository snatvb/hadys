import { BaseComponentClass, Component } from './component'
import { ComponentContainer } from './ComponentContainer'
import {
  IAddable,
  IAfterUpdatable,
  IBeforeUpdatable,
  IComponentAddable,
  IComponentRemovable,
  IExtension,
  IRemovable,
  isAddable,
  isAfterUpdatable,
  isBeforeUpdatable,
  isComponentAddable,
  isComponentRemovable,
  isRemovable,
} from './IExtension'
import { Entity, START_ENTITY_ID } from './entity'
import { sortSystems } from './helpers'
import { ISystem } from './ISystem'
import { IWorld } from './IWorld'

const initExtensions = () => ({
  afterUpdatable: new Set<IAfterUpdatable>(),
  beforeUpdatable: new Set<IBeforeUpdatable>(),
  addable: new Set<IAddable>(),
  removable: new Set<IRemovable>(),
  componentAddable: new Set<IComponentAddable>(),
  componentRemovable: new Set<IComponentRemovable>(),
})

export class World implements IWorld {
  private _entities = new Map<Entity, ComponentContainer>()
  private _systems = new Set<ISystem>()
  private _extensions = initExtensions()

  private _nextEntityID = START_ENTITY_ID
  private _entitiesToDestroy: Entity[] = []

  get entitiesCount(): number {
    return this._entities.size
  }

  addEntity(): Entity {
    let entity = this._nextEntityID
    this._nextEntityID++
    this._entities.set(entity, new ComponentContainer())
    this._extensions.addable.forEach((extension) => extension.addEntity(entity))
    return entity
  }

  removeEntity(entity: Entity): void {
    this._entitiesToDestroy.push(entity)
    this._extensions.removable.forEach((extension) =>
      extension.removeEntity(entity),
    )
  }

  addComponent(entity: Entity, component: Component): void {
    this._entities.get(entity)!.add(component)
    this._extensions.componentAddable.forEach((extension) =>
      extension.addComponent(entity, component),
    )

    this._updateEntity(entity)
  }

  getComponents(entity: Entity) {
    return this._entities.get(entity)
  }

  removeComponent(entity: Entity, componentClass: BaseComponentClass): void {
    this._entities.get(entity)!.delete(componentClass)
    this._extensions.componentRemovable.forEach((extension) =>
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
    this._extensions = initExtensions()
    for (let extension of extensions) {
      this.addExtension(extension)
    }
  }

  addExtension(extension: IExtension): void {
    if (isBeforeUpdatable(extension)) {
      this._extensions.beforeUpdatable.add(extension)
    }
    if (isAfterUpdatable(extension)) {
      this._extensions.afterUpdatable.add(extension)
    }
    if (isAddable(extension)) {
      this._extensions.addable.add(extension)
    }
    if (isRemovable(extension)) {
      this._extensions.removable.add(extension)
    }
    if (isComponentAddable(extension)) {
      this._extensions.componentAddable.add(extension)
    }
    if (isComponentRemovable(extension)) {
      this._extensions.componentRemovable.add(extension)
    }
  }

  update(): void {
    this._extensions.beforeUpdatable.forEach((extension) =>
      extension.beforeUpdate(),
    )
    for (let system of this._systems) {
      system.update()
    }
    this._extensions.afterUpdatable.forEach((extension) =>
      extension.afterUpdate(),
    )

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
