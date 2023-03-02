import 'pixi-spine'
export * as pixiSpine from 'pixi-spine'
export { Spine } from 'pixi-spine'
export * as hadys from './engine'
import * as PIXI from 'pixi.js'
import type { Engine } from './engine'

import { core, render, debug } from './plugins'
import { Loop } from './loop'
import { Builder } from './builder'
import { ECS } from './ecs'

export { ECS, Builder, Loop, render, core, debug, PIXI }

export type HadysEngine = Engine
