import { SyncContainerSystem } from './systems'

export { Sprite } from 'pixi.js'

export * as components from './components'

export function create() {
  return [new SyncContainerSystem()]
}
