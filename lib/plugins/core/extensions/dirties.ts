import { ECS } from '../../../ecs'

export class DirtyComponent {
  protected _dirty = true

  public get dirty(): boolean {
    return this._dirty
  }

  resetDirty(): void {
    this._dirty = false
    DirtiesExtension.$$dirties.delete(this)
  }

  protected _markDirty(): void {
    this._dirty = true
    DirtiesExtension.$$dirties.add(this)
  }
}

export class DirtiesExtension extends ECS.Extension {
  public static $$dirties: Set<DirtyComponent> = new Set()

  removeEntity(entity: ECS.Entity): void {
    const components = this.world.getComponents(entity)
    if (components) {
      for (let component of components.values()) {
        if (component instanceof DirtyComponent) {
          DirtiesExtension.$$dirties.delete(component)
        }
      }
    }
  }

  addComponent(entity: ECS.Entity, component: ECS.Component): void {
    if (component instanceof DirtyComponent) {
      DirtiesExtension.$$dirties.add(component)
    }
  }

  removeComponent(
    entity: ECS.Entity,
    componentClass: ECS.BaseComponentClass,
  ): void {
    const component = this.world.getComponents(entity)!.get(componentClass)!
    if (component instanceof DirtyComponent) {
      DirtiesExtension.$$dirties.delete(component)
    }
  }

  afterUpdate(): void {
    for (let dirtyComponent of DirtiesExtension.$$dirties) {
      dirtyComponent.resetDirty()
    }
  }
}
