import { Assets } from './assets'
import { ECS } from './ecs'
import { HadysContext, HadysPlugin } from './shared-interfaces'

export class Builder {
  private _systems: ECS.ISystem[] = []
  private _extensions: ECS.IExtension[] = []
  private _context: HadysContext

  constructor(
    public world: ECS.World = new ECS.World(),
    public assets: Assets = new Assets(),
  ) {
    this._context = {
      world: this.world,
      assets: this.assets,
    }
  }

  get context() {
    return this._context
  }

  addPlugin(plugin: HadysPlugin) {
    this._systems = [...this._systems, ...plugin.systems]
    this._extensions = [...this._extensions, ...plugin.extensions]
    return this
  }

  addSystem(system: ECS.ISystem) {
    this._systems.push(system)
    return this
  }

  addExtension(extension: ECS.IExtension) {
    this._extensions.push(extension)
    return this
  }

  build() {
    this.world.setSystems(this._systems)
    this.world.setExtensions(this._extensions)
    this.world.start()
  }
}
