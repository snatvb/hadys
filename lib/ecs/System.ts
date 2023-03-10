import { BaseComponentClass } from './component'
import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { IFilter } from './IFilter'
import { IBaseSystem, ISystem } from './ISystem'
import { IWorld } from './IWorld'

export const isUpdatableSystem = (
  system: ISystem | IBaseSystem,
): system is ISystem => {
  return 'update' in system
}

export function System(type: Symbol | string) {
  return class System implements IBaseSystem {
    readonly _filters: Record<string, IFilter> = {}
    _filterValues!: IFilter[]
    public static Type: Symbol = typeof type === 'string' ? Symbol(type) : type
    public sort: ISystem['sort'] = { type: 'none' }
    public world!: IWorld

    public init(): void {}

    public prepareFilters() {
      this._filterValues = Object.values(this._filters)
      for (let filter of this._filterValues) {
        filter.system = this
      }
    }

    public get type(): Symbol {
      return (this.constructor as typeof System).Type
    }
    public componentsRequired: Set<BaseComponentClass> = new Set()
    public ecs?: IWorld

    public updateEntity(entity: Entity, components: ComponentContainer): void {
      for (let filter of this._filterValues) {
        filter.update(entity, components)
      }
    }

    validate() {
      if (this._filterValues.length == 0) {
        console.error('System not added: empty Filters list.')
        console.error(this)
        return false
      }
      return true
    }

    public deleteEntity(entity: Entity): void {
      for (let filter of this._filterValues) {
        filter.deleteEntity(entity)
      }
    }

    public destroy(): void {}
  }
}
