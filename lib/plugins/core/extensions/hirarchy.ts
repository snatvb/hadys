import { ECS } from '../../../ecs'
import { Hierarchy } from '../components'

export class HierarchyExtension extends ECS.Extension {
  removeEntity(entity: ECS.Entity): void {
    const hierarchy = this.world.getComponents(entity)!.get(Hierarchy)
    if (hierarchy) {
      for (const child of hierarchy.children) {
        this.world.removeEntity(child)
      }
      if (hierarchy.parent) {
        this.world
          .getComponents(hierarchy.parent)
          ?.get(Hierarchy)!
          .removeChild(entity)
      }
    }
  }

  addComponent(entity: ECS.Entity, component: ECS.Component): void {
    if (component instanceof Hierarchy) {
      if (component.parent) {
        this.world
          .getComponents(component.parent)!
          .get(Hierarchy)!
          .addChild(entity)
      }
    }
  }

  removeComponent(
    entity: ECS.Entity,
    componentClass: ECS.BaseComponentClass,
  ): void {
    const component = this.world.getComponents(entity)!.get(componentClass)
    if (component instanceof Hierarchy) {
      if (component.parent) {
        for (const child of component.children) {
          const childHierarchy = this.world
            .getComponents(child)!
            .get(componentClass) as Hierarchy
          childHierarchy.parent = null
        }
        if (component.parent) {
          this.world
            .getComponents(component.parent)
            ?.get(Hierarchy)!
            .removeChild(entity)
        }
      }
    }
  }
}
