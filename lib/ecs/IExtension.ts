import { BaseComponentClass, Component } from './component'
import { Entity } from './entity'

export interface IExtension {
  addEntity(entity: Entity): void
  removeEntity(entity: Entity): void
  addComponent(entity: Entity, component: Component): void
  removeComponent(entity: Entity, componentClass: BaseComponentClass): void
  update(): void
}
