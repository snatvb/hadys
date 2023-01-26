export * as hadys from './engine'
import type { Engine } from './engine'

import { core, render, debug } from './plugins'
import { Loop } from './loop'
import { Builder } from './builder'
import { ECS } from './ecs'

export { ECS, Builder, Loop, render, core, debug }

export type HadysEngine = Engine
