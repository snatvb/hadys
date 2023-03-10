import { Loop } from './loop'
import { Assets } from './assets'
import { Builder } from './builder'
import { ECS } from './ecs'
export * from './plugins/core'
import * as plugins from './plugins'

export const components = {
  ...plugins.core.components,
  ...plugins.render.components,
}

export { ECS, plugins, Builder, Loop }

export const create = () => {
  const assets = new Assets()
  const world = new ECS.World()
  const ctx = { world, assets }

  return ctx
}

export type Engine = ReturnType<typeof create>
