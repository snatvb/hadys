import { hadys } from '../lib/main'

class SimpleMoveSystem extends hadys.ECS.System(Symbol('SimpleMoveSystem')) {
  _filters = {
    transforms: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.core.components.Transform]),
    ]),
  }

  update() {
    for (const filter of this._filters.transforms) {
      const transform = filter.components.get(hadys.core.components.Transform)!
      if (transform.x === 0) {
        continue
      }
      transform.set((transform.x + 2) % 100, (transform.y + 2) % 100)
    }
  }
}

export function startGame(view: HTMLCanvasElement) {
  let intervalId: number = 0
  ;(async () => {
    const engine = hadys.create()
    const corePlugin = hadys.plugins.core.create(engine.world)
    const renderPlugin = hadys.plugins.render.create(engine, {
      size: {
        width: 800,
        height: 600,
      },
      view,
    })

    engine.world.setExtensions([...corePlugin.extensions])
    engine.world.setSystems([
      new SimpleMoveSystem(),
      ...renderPlugin.systems,
      ...corePlugin.systems,
    ])

    await engine.assets.loadResources({
      sprites: {
        logo: {
          name: 'logo',
          path: 'hadys.png',
        },
      },
    })

    const sprite = new hadys.plugins.render.Sprite(
      engine.assets.get('logo') as any,
    )
    const entity = engine.world.addEntity()
    engine.world.addComponent(
      entity,
      new hadys.plugins.render.components.Sprites({
        logo: sprite,
      }),
    )
    engine.world.addComponent(
      entity,
      new hadys.plugins.render.components.Container(),
    )
    engine.world.addComponent(
      entity,
      new hadys.core.components.Transform(100, 100),
    )
    engine.world.update()

    intervalId = setInterval(() => {
      engine.world.update()
    }, 50)
  })()

  return () => {
    clearInterval(intervalId)
  }
}
