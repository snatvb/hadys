import { hadys } from '../../lib/main'
import { FPSTag } from './components'
import { worldTimeFilter } from './world-time'

export class FPSDisplaySystem extends hadys.ECS.System('FPSDisplaySystem') {
  _filters = {
    time: worldTimeFilter,
    views: new hadys.ECS.Filter([
      new hadys.ECS.Includes([
        hadys.plugins.render.components.DisplayObject,
        FPSTag,
      ]),
    ]),
  }

  update() {
    const time = this._filters.time.first()!
    const delta = time.components.get(hadys.core.components.Time)!.delta

    for (const filter of this._filters.views) {
      const displayObject = filter.components.get(
        hadys.plugins.render.components
          .DisplayObject<hadys.plugins.render.Text>,
      )!
      const text = displayObject.object
      text.text = `${Math.round(1000 / delta)} FPS`
    }
  }
}
