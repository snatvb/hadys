import { BaseComponentClass } from './component'
import { ComponentContainer } from './ComponentContainer'

export interface IRule {
  check(container: ComponentContainer): boolean
}

export class Rule {}

export class MultiRule extends Rule {
  protected readonly _components: Set<BaseComponentClass>
  constructor(components: BaseComponentClass[]) {
    super()
    this._components = new Set(components)
  }
}

export class Includes extends MultiRule implements IRule {
  check(container: ComponentContainer): boolean {
    return container.hasAll(this._components)
  }
}

export class Exclude extends MultiRule implements IRule {
  check(container: ComponentContainer): boolean {
    for (let component of this._components) {
      if (container.has(component)) {
        return false
      }
    }
    return true
  }
}

export class Has extends Rule implements IRule {
  constructor(protected readonly _component: BaseComponentClass) {
    super()
  }

  check(container: ComponentContainer): boolean {
    return container.has(this._component)
  }
}

export class Only extends Rule implements IRule {
  constructor(protected readonly _component: BaseComponentClass) {
    super()
  }

  check(container: ComponentContainer): boolean {
    return container.has(this._component) && container.size === 1
  }
}
