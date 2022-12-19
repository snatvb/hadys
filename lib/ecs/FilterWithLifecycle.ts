import { ComponentContainer } from './ComponentContainer'
import { Entity } from './entity'
import { Filter } from './Filter'

export class FilterWithLifecycle extends Filter {
  onAppeared: (entity: Entity, components: ComponentContainer) => void =
    () => {}
  onDisappeared: (entity: Entity, components: ComponentContainer) => void =
    () => {}

  update(entity: Entity, components: ComponentContainer): boolean {
    const was = this.entities.has(entity)
    const appeared = super.update(entity, components)
    if (appeared) {
      this.onAppeared(entity, components)
    } else {
      if (was) {
        this.onDisappeared(entity, components)
      }
    }
    return appeared
  }

  deleteEntity(entity: Entity): boolean {
    if (!this.entities.has(entity)) {
      return false
    }
    this.onDisappeared(entity, this.entities.get(entity)!.components)
    return super.deleteEntity(entity)
  }
}
