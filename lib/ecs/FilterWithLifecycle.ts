import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { Filter } from './Filter'

export class FilterWithLifecycle extends Filter {
  onAppeared: (entity: Entity, components: ComponentContainer) => void =
    () => {}
  onDisappeared: (entity: Entity, components: ComponentContainer) => void =
    () => {}

  update(entity: Entity, components: ComponentContainer): boolean {
    const appeared = super.update(entity, components)
    if (appeared) {
      this.onAppeared(entity, components)
    } else {
      this.onDisappeared(entity, components)
    }
    return appeared
  }

  deleteEntity(entity: Entity): boolean {
    this.onDisappeared(entity, this.entities.get(entity)!.components)
    return super.deleteEntity(entity)
  }
}
