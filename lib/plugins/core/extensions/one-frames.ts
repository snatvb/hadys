import { ECS } from '../../../ecs'

export class OneFrameComponent extends ECS.Component {}

export class OneFramesExtension extends ECS.Extension {
  public static $$oneFrames: Set<OneFrameComponent> = new Set()

  removeEntity(entity: ECS.Entity): void {
    const components = this.world.getComponents(entity)
    if (components) {
      for (let component of components.values()) {
        if (component instanceof OneFrameComponent) {
          OneFramesExtension.$$oneFrames.delete(component)
        }
      }
    }
  }

  addComponent(entity: ECS.Entity, component: ECS.Component): void {
    if (component instanceof OneFrameComponent) {
      OneFramesExtension.$$oneFrames.add(component)
    }
  }

  removeComponent(
    entity: ECS.Entity,
    componentClass: ECS.BaseComponentClass,
  ): void {
    const component = this.world.getComponents(entity)!.get(componentClass)!
    if (component instanceof OneFrameComponent) {
      OneFramesExtension.$$oneFrames.delete(component)
    }
  }
}
