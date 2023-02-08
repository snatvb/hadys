import {
  Assets as PixiAssets,
  AssetsClass,
  FormatDetectionParser,
} from '@pixi/assets'

export type Resources = {
  [ctx: string]: Record<
    string,
    {
      name: string
      path: string
    }
  >
}

export interface IAssets extends Omit<AssetsClass, 'resolver'> {
  loadResources(resources: Resources): Promise<void>
}

export class Assets implements IAssets {
  constructor() {}

  get preferWorkers(): boolean {
    return PixiAssets.preferWorkers
  }
  set preferWorkers(value: boolean) {
    PixiAssets.preferWorkers = value
  }

  async loadResources(resources: Resources): Promise<void> {
    const names = Object.entries(resources).flatMap(([ctx, values]) =>
      Object.values(values).map((resource) => {
        const name = `${ctx}.${resource.name}`
        this.add(name, resource.path)
        return name
      }),
    )
    await this.load(names)
  }

  get detections(): FormatDetectionParser[] {
    return PixiAssets.detections
  }

  get cache(): typeof PixiAssets.cache {
    return PixiAssets.cache
  }

  get loader() {
    return PixiAssets.loader
  }

  init = PixiAssets.init.bind(PixiAssets)
  add = PixiAssets.add.bind(PixiAssets)
  load = PixiAssets.load.bind(PixiAssets)
  addBundle = PixiAssets.addBundle.bind(PixiAssets)
  loadBundle = PixiAssets.loadBundle.bind(PixiAssets)
  backgroundLoad = PixiAssets.backgroundLoad.bind(PixiAssets)
  backgroundLoadBundle = PixiAssets.backgroundLoadBundle.bind(PixiAssets)
  reset = PixiAssets.reset.bind(PixiAssets)
  get = PixiAssets.get.bind(PixiAssets)
  unload = PixiAssets.unload.bind(PixiAssets)
  unloadBundle = PixiAssets.unloadBundle.bind(PixiAssets)
}
