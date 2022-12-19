import { Assets } from '../../assets'
import { PIXI } from './dependencies'

export interface Size {
  width: number
  height: number
}

export interface Config {
  size: Size
  backgroundColor?: number
  antialias?: boolean
  resolution?: number
  view?: HTMLCanvasElement
}

export interface Dependencies {
  assets: Assets
}

export interface RenderApp {
  pixi: PIXI.Application
  assets: Assets
}
