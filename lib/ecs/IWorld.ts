import { BaseComponentClass, Component } from './component'
import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { ExtensionClass, IExtension } from './extensions'
import { ISystem } from './ISystem'

export interface IWorld {
  start(): void
  addEntity(): Entity
  removeEntity(entity: Entity): void
  addComponent(entity: Entity, component: Component): void
  getComponents(entity: Entity): ComponentContainer | undefined
  removeComponent(entity: Entity, componentClass: BaseComponentClass): void
  update(): void
  setSystems(systems: ISystem[]): void
  setExtensions(extensions: IExtension[]): void
  addExtension(extension: IExtension): void
  getExtension<T extends IExtension>(extensionClass: ExtensionClass<T>): T
  destroy(): void
}
