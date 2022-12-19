import { Assets } from './assets'
import { ECS } from './ecs'

export { ECS }

export const create = () => {
  const assets = new Assets()
  const world = new ECS.World()
  const ctx = { world, assets }

  return ctx
}
