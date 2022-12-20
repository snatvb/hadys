import { BaseComponentClass, Component, ComponentClass } from './component'

export class ComponentContainer {
  private _map = new Map<BaseComponentClass, Component>()

  public get size(): number {
    return this._map.size
  }

  public add(component: Component): void {
    this._map.set(component.constructor as BaseComponentClass, component)
  }

  public get<T extends Component>(componentClass: ComponentClass<T>): T {
    return this._map.get(componentClass) as T
  }

  public has(componentClass: BaseComponentClass): boolean {
    return this._map.has(componentClass)
  }

  public hasAll(componentClasses: Iterable<BaseComponentClass>): boolean {
    for (let cls of componentClasses) {
      if (!this._map.has(cls)) {
        return false
      }
    }
    return true
  }

  public delete(componentClass: BaseComponentClass): void {
    this._map.delete(componentClass)
  }

  public values(): IterableIterator<Component> {
    return this._map.values()
  }
}
