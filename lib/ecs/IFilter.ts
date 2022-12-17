import { ISystem } from 'pixi.js'
import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'

export interface FilterItem {
  entity: Entity
  components: ComponentContainer
}

export interface IFilter {
  system: ISystem

  update(entity: Entity, container: ComponentContainer): boolean
  deleteEntity(entity: Entity): boolean
}
