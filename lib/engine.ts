import { Assets } from './assets'
import { ECS } from './ecs'
export * from './plugins/core'
import * as plugins from './plugins'

export { ECS, plugins }

export const create = () => {
  const assets = new Assets()
  const world = new ECS.World()
  const ctx = { world, assets }

  return ctx
}
