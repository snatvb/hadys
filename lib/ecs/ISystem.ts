import { BaseComponentClass } from './component'
import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { IWorld } from './IWorld'

export interface IBaseSystem {
  sort:
    | {
        type: 'before' | 'after'
        system: Symbol
      }
    | {
        type: 'none'
      }
  type: Symbol
  world: IWorld
  init(): void
  validate(): boolean
  updateEntity(entity: Entity, components: ComponentContainer): void
  deleteEntity(entity: Entity): void
  destroy(): void
}

export interface ISystem extends IBaseSystem {
  update(): void
}
