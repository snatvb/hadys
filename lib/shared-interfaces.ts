import { Assets } from './assets'
import { ECS } from './ecs'
import { IExtension } from './ecs/extensions'

export interface HadysContext {
  world: ECS.World
  assets: Assets
}

export interface HadysPlugin {
  systems: ECS.ISystem[]
  extensions: IExtension[]
}
