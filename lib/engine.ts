import { Assets } from './assets'
import { ECS } from './ecs'

export { ECS }

export const create = () => {
  const world = new ECS.World()
  const assets = new Assets()
  const ctx = { world, assets }

  return ctx
}
