import { Assets } from './assets'
import { ECS } from './ecs'

export interface HadysContext {
  world: ECS.World
  assets: Assets
}
