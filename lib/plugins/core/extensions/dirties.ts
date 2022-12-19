import { ECS } from '../../../ecs'

export class DirtyComponent {
  protected _dirty = false

  public get dirty(): boolean {
    return this._dirty
  }

  resetDirty(): void {
    this._dirty = false
  }

  protected _markDirty(): void {
    this._dirty = true
  }
}

export class DirtiesExtension implements ECS.IExtension {
  private _dirtyComponents = new Map<ECS.Entity, Set<ECS.BaseComponentClass>>()

  constructor(private _world: ECS.IWorld) {}

  addEntity(entity: ECS.Entity): void {
    this._dirtyComponents.set(entity, new Set())
  }

  removeEntity(entity: ECS.Entity): void {
    this._dirtyComponents.delete(entity)
  }

  addComponent(entity: ECS.Entity, component: ECS.Component): void {
    if (component instanceof DirtyComponent) {
      this._dirtyComponents
        .get(entity)!
        .add(component.constructor as ECS.BaseComponentClass)
    }
  }

  removeComponent(
    entity: ECS.Entity,
    componentClass: ECS.BaseComponentClass,
  ): void {
    this._dirtyComponents.get(entity)!.delete(componentClass)
  }

  update(): void {
    for (let [entity, constructors] of this._dirtyComponents) {
      for (let constructor of constructors) {
        const dirtyComponent = this._world
          .getComponents(entity)!
          .get(constructor)! as DirtyComponent
        dirtyComponent.resetDirty()
      }
    }
  }
}
