import { PIXI } from './dependencies'
import { RenderExtension } from './extension'
import { Config, Dependencies, RenderApp } from './interfaces'
import { SyncContainerSystem } from './systems'

export { Sprite, Text, Graphics } from 'pixi.js'
export { RenderExtension }

export * as components from './components'
export * as systems from './systems'

export function create(dependencies: Dependencies, config: Config) {
  const { assets } = dependencies
  const app = new PIXI.Application(config)
  const renderApp: RenderApp = { pixi: app, assets }
  return {
    app,
    systems: [new SyncContainerSystem(renderApp)],
    extensions: [new RenderExtension(app)],
  }
}
