import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { FilterItem, IFilter } from './IFilter'
import { ISystem } from './ISystem'
import { IRule } from './rules'

export class Filter implements IFilter, Iterable<FilterItem> {
  entities = new Map<Entity, FilterItem>()
  system!: ISystem
  constructor(private readonly _rules: IRule[]) {}

  update(entity: Entity, components: ComponentContainer): boolean {
    if (this._rules.every((rule) => rule.check(components))) {
      this.entities.set(entity, {
        entity,
        components,
      })
      return true
    } else {
      this.entities.delete(entity)
      return false
    }
  }

  deleteEntity(entity: Entity) {
    return this.entities.delete(entity)
  }

  [Symbol.iterator](): Iterator<FilterItem, any, undefined> {
    return this.entities.values()
  }

  first(): FilterItem | undefined {
    return this.entities.values().next().value
  }
}
