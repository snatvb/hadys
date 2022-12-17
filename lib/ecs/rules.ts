import { BaseComponentClass } from './component'
import { ComponentContainer } from './ComponentContainer'

export interface IRule {
  check(container: ComponentContainer): boolean
}

export class Rule {
  protected readonly _components: Set<BaseComponentClass>
  constructor(components: BaseComponentClass[]) {
    this._components = new Set(components)
  }
}

export class Includes extends Rule implements IRule {
  check(container: ComponentContainer): boolean {
    return container.hasAll(this._components)
  }
}

export class Exclude extends Rule implements IRule {
  check(container: ComponentContainer): boolean {
    for (let component of this._components) {
      if (container.has(component)) {
        return false
      }
    }
    return true
  }
}
