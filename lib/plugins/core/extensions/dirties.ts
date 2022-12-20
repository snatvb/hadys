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

export class DirtiesExtension implements ECS.IExtension {
  public static $$dirties: Set<DirtyComponent> = new Set()

  constructor(private _world: ECS.IWorld) {}

  removeEntity(entity: ECS.Entity): void {
    const components = this._world.getComponents(entity)
    if (components) {
      for (let component of components.values()) {
        if (component instanceof DirtyComponent) {
          DirtiesExtension.$$dirties.delete(component)
        }
      }
    }
  }

  removeComponent(
    entity: ECS.Entity,
    componentClass: ECS.BaseComponentClass,
  ): void {
    const component = this._world.getComponents(entity)!.get(componentClass)!
    if (component instanceof DirtyComponent) {
      DirtiesExtension.$$dirties.delete(component)
    }
  }

  update(): void {
    for (let dirtyComponent of DirtiesExtension.$$dirties) {
      dirtyComponent.resetDirty()
    }
  }
}
