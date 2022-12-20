import { hadys } from '../lib/main'

class SimpleMoveSystem extends hadys.ECS.System(Symbol('SimpleMoveSystem')) {
  _filters = {
    transforms: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.core.components.Position]),
    ]),
  }

  update() {
    for (const filter of this._filters.transforms) {
      const transform = filter.components.get(hadys.core.components.Position)!
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
          path: '/logo.png',
        },
      },
    })

    const rootEntity = engine.world.addEntity()

    const entity = createContainer(engine, { x: 10, y: 10 })

    engine.world.addComponent(
      entity,
      new hadys.core.components.Hierarchy(rootEntity),
    )

    const sprite = new hadys.plugins.render.Sprite(
      engine.assets.get('logo') as any,
    )
    const spriteEntity = engine.world.addEntity()
    engine.world.addComponent(
      spriteEntity,
      new hadys.plugins.render.components.DisplayObject(sprite),
    )
    engine.world.addComponent(
      spriteEntity,
      new hadys.core.components.Hierarchy(entity),
    )

    const text = new hadys.plugins.render.Text('Hadys', {
      fontFamily: 'Arial',
      align: 'center',
      fontSize: 24,
      fill: 0xeeeeee,
    })
    text.anchor.set(0.5)
    text.position.set(100, 100)
    const textEntity = engine.world.addEntity()
    engine.world.addComponent(
      textEntity,
      new hadys.plugins.render.components.DisplayObject(text),
    )
    engine.world.addComponent(
      textEntity,
      new hadys.core.components.Hierarchy(entity),
    )

    intervalId = setInterval(() => {
      engine.world.update()
    }, 16)
  })()

  return () => {
    clearInterval(intervalId)
  }

  function createContainer(
    engine: ReturnType<typeof hadys.create>,
    position: { x: number; y: number },
  ) {
    const entity = engine.world.addEntity()
    engine.world.addComponent(entity, new hadys.core.components.Hierarchy())
    engine.world.addComponent(
      entity,
      new hadys.plugins.render.components.Container(),
    )
    engine.world.addComponent(
      entity,
      new hadys.core.components.Position(position.x, position.y),
    )
    engine.world.update()
    return entity
  }
}
