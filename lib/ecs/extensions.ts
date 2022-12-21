import { BaseComponentClass, Component } from './component'
import { Entity } from './entity'
import { IWorld } from './IWorld'

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

type PartialSigns = Partial<
  IAddable &
    IRemovable &
    IComponentAddable &
    IComponentRemovable &
    IAfterUpdatable &
    IBeforeUpdatable
>

export interface IExtension extends PartialSigns {
  world: IWorld
  destroy(): void
}

export type ExtensionClass<T extends IExtension = IExtension> = new (
  ...args: any[]
) => T

export const isAfterUpdatable = (
  extension: IExtension | IAfterUpdatable,
): extension is IAfterUpdatable => {
  return 'afterUpdate' in extension
}

export const isBeforeUpdatable = (
  extension: IExtension | IBeforeUpdatable,
): extension is IBeforeUpdatable => {
  return 'beforeUpdate' in extension
}

export const isAddable = (
  extension: IExtension | IAddable,
): extension is IAddable => {
  return 'addEntity' in extension
}

export const isRemovable = (
  extension: IExtension | IRemovable,
): extension is IRemovable => {
  return 'removeEntity' in extension
}

export const isComponentAddable = (
  extension: IExtension | IComponentAddable,
): extension is IComponentAddable => {
  return 'addComponent' in extension
}

export const isComponentRemovable = (
  extension: IExtension | IComponentRemovable,
): extension is IComponentRemovable => {
  return 'removeComponent' in extension
}

export abstract class Extension implements IExtension {
  public world!: IWorld
  public destroy(): void {}
}
