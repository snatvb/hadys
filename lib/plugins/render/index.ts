import { PIXI } from './dependencies'
import { Config, Dependencies, RenderApp } from './interfaces'
import { SyncContainerSystem } from './systems'

export { Sprite } from 'pixi.js'

export * as components from './components'

export function create(dependencies: Dependencies, config: Config) {
  const { assets } = dependencies
  const app = new PIXI.Application(config)
  const renderApp: RenderApp = { pixi: app, assets }
  return [new SyncContainerSystem(renderApp)]
}
