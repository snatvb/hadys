import { BaseComponentClass, Component, ComponentClass } from './component'

export class ComponentContainer {
  private map = new Map<BaseComponentClass, Component>()

  public add(component: Component): void {
    this.map.set(component.constructor as BaseComponentClass, component)
  }

  public get<T extends Component>(componentClass: ComponentClass<T>): T {
    return this.map.get(componentClass) as T
  }

  public has(componentClass: BaseComponentClass): boolean {
    return this.map.has(componentClass)
  }

  public hasAll(componentClasses: Iterable<BaseComponentClass>): boolean {
    for (let cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false
      }
    }
    return true
  }

  public delete(componentClass: BaseComponentClass): void {
    this.map.delete(componentClass)
  }

  public values(): IterableIterator<Component> {
    return this.map.values()
  }
}
