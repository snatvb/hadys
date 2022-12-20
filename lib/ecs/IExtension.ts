import { BaseComponentClass, Component } from './component'
import { Entity } from './entity'

export interface IAddable {
  addEntity(entity: Entity): void
}

export interface IRemovable {
  removeEntity(entity: Entity): void
}

export interface IComponentAddable {
  addComponent(entity: Entity, component: Component): void
}

export interface IComponentRemovable {
  removeComponent(entity: Entity, componentClass: BaseComponentClass): void
}

export interface IBeforeUpdatable {
  beforeUpdate(): void
}

export interface IAfterUpdatable {
  afterUpdate(): void
}

export type IExtension = Partial<
  IAddable &
    IRemovable &
    IComponentAddable &
    IComponentRemovable &
    IAfterUpdatable &
    IBeforeUpdatable
>

export const isAfterUpdatable = (
  extension: IExtension,
): extension is IAfterUpdatable => {
  return 'afterUpdate' in extension
}

export const isBeforeUpdatable = (
  extension: IExtension,
): extension is IBeforeUpdatable => {
  return 'beforeUpdate' in extension
}

export const isAddable = (extension: IExtension): extension is IAddable => {
  return 'addEntity' in extension
}

export const isRemovable = (extension: IExtension): extension is IRemovable => {
  return 'removeEntity' in extension
}

export const isComponentAddable = (
  extension: IExtension,
): extension is IComponentAddable => {
  return 'addComponent' in extension
}

export const isComponentRemovable = (
  extension: IExtension,
): extension is IComponentRemovable => {
  return 'removeComponent' in extension
}
