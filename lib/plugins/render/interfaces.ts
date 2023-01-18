import { Assets } from '../../assets'
import { PIXI } from './dependencies'

export interface Size {
  width: number
  height: number
}

export interface Config extends PIXI.IApplicationOptions {}

export interface Dependencies {
  assets: Assets
}

export interface RenderApp {
  pixi: PIXI.Application
  assets: Assets
}
