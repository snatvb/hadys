import { Sprite } from 'pixi.js'
import { ECS } from '../../ecs'
import { core } from '../core'
import * as components from './components'
import { RenderApp } from './interfaces'

export class SyncContainerSystem extends ECS.System(
  'Hadys::SyncContainerSystem',
) {
  _filters = {
    objects: new ECS.FilterWithLifecycle([
      new ECS.Includes([components.DisplayObject, core.components.Hierarchy]),
    ]),
    containers: new ECS.FilterWithLifecycle([
      new ECS.Includes([
        components.Container,
        core.components.Hierarchy,
        core.components.Transform,
      ]),
    ]),
  }

  constructor(private _app: RenderApp) {
    super()

    this._addSpritesLifecycle()
    this._addContainersLifecycle()
  }

  private _getParentWithContainer(hierarchy: core.components.Hierarchy) {
    if (hierarchy.parent) {
      const ccParent = this.world.getComponents(hierarchy.parent)!
      if (!ccParent.has(components.Container)) {
        return undefined
      }
      const { container: containerParent } = ccParent.get(components.Container)!
      const hierarchyParent = ccParent.get(core.components.Hierarchy)!
      return {
        container: containerParent,
        hierarchy: hierarchyParent,
      }
    }
    return undefined
  }

  private _addContainersLifecycle() {
    const createHandleLifecycle =
      (kind: 'onAppeared' | 'onDisappeared') =>
      (entity: ECS.Entity, cc: ECS.ComponentContainer) => {
        const hierarchy = cc.get(core.components.Hierarchy)!
        const { container } = cc.get(components.Container)!
        const parent = this._getParentWithContainer(hierarchy)
        if (kind === 'onAppeared') {
          if (parent) {
            parent.hierarchy.addChild(entity)
            parent.container.addChild(container)
          } else {
            this._app.pixi.stage.addChild(container)
          }
        } else {
          if (parent) {
            parent.hierarchy.removeChild(entity)
            parent.container.removeChild(container)
          } else {
            this._app.pixi.stage.removeChild(container)
          }
        }
      }

    this._filters.containers.onAppeared = createHandleLifecycle('onAppeared')
    this._filters.containers.onDisappeared =
      createHandleLifecycle('onDisappeared')
  }

  private _addSpritesLifecycle() {
    const createHandleLifecycle =
      (kind: 'onAppeared' | 'onDisappeared') =>
      (entity: ECS.Entity, cc: ECS.ComponentContainer) => {
        const hierarchy = cc.get(core.components.Hierarchy)!
        const { object } = cc.get(components.DisplayObject)!

        if (!hierarchy.parent) {
          return console.warn('Sprite has no parent')
        }

        const ccParent = this.world.getComponents(hierarchy.parent)!
        const { container } = ccParent.get(components.Container)!
        const hierarchyParent = ccParent.get(core.components.Hierarchy)!
        if (kind === 'onAppeared') {
          container.addChild(object)
          hierarchyParent.children.add(entity)
        } else {
          container.removeChild(object)
          hierarchyParent.children.delete(entity)
        }
      }

    this._filters.objects.onAppeared = createHandleLifecycle('onAppeared')
    this._filters.objects.onDisappeared = createHandleLifecycle('onDisappeared')
  }

  update() {
    for (const item of this._filters.containers) {
      const transform = item.components.get(core.components.Transform)!
      if (transform.dirty) {
        const { container } = item.components.get(components.Container)!
        container.position.set(transform.position.x, transform.position.y)
        container.scale.set(transform.scale.x, transform.scale.y)
        container.angle = transform.rotation.angle
      }
    }
  }
}
