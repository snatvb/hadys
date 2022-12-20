import { hadys } from '../lib/main'

class FPSTag extends hadys.ECS.Component {}
class MovableTag extends hadys.ECS.Component {}

class SimpleMoveSystem extends hadys.ECS.System(Symbol('SimpleMoveSystem')) {
  _filters = {
    positions: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.core.components.Position, MovableTag]),
    ]),
  }

  update() {
    for (const filter of this._filters.positions) {
      const position = filter.components.get(hadys.core.components.Position)!
      if (position.x === 0) {
        continue
      }
      position.set((position.x + 2) % 100, (position.y + 2) % 100)
    }
  }
}

class FPSDisplaySystem extends hadys.ECS.System('FPSDisplaySystem') {
  _filters = {
    time: new hadys.ECS.Filter([
      new hadys.ECS.Includes([
        hadys.core.components.WorldTimeTag,
        hadys.core.components.Time,
      ]),
    ]),
    views: new hadys.ECS.Filter([
      new hadys.ECS.Includes([
        hadys.plugins.render.components.DisplayObject,
        FPSTag,
      ]),
    ]),
  }

  update() {
    const time = this._filters.time.first()
    if (!time) {
      return
    }

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

export function startGame(view: HTMLCanvasElement) {
  let intervalId: number = 0
  ;(async () => {
    const engine = hadys.create()
    const corePlugin = hadys.plugins.core.create(engine.world)
    const physicsPlugin = hadys.plugins.physics.create({ engine: {} })
    const renderPlugin = hadys.plugins.render.create(engine, {
      size: {
        width: 800,
        height: 600,
      },
      view,
    })
    const debugPlugin = hadys.plugins.debug.create(
      physicsPlugin.engine,
      renderPlugin.app,
    )

    engine.world.setExtensions([...corePlugin.extensions])
    engine.world.setSystems([
      ...physicsPlugin.systems,
      new SimpleMoveSystem(),
      new FPSDisplaySystem(),
      ...corePlugin.systems,
      ...renderPlugin.systems,
      ...debugPlugin.systems,
    ])
    hadys.core.entities.time(engine.world)

    await engine.assets.loadResources({
      sprites: {
        logo: {
          name: 'logo',
          path: '/logo.png',
        },
        danger: {
          name: 'danger',
          path: '/danger.png',
        },
      },
    })

    const rootEntity = engine.world.addEntity()
    addMainSprite(engine, rootEntity)

    const entityContainer = createContainer(engine, { x: 400, y: 200 })

    const entity = engine.world.addEntity()
    engine.world.addComponent(
      entity,
      new hadys.core.components.Hierarchy(entityContainer),
    )
    const sprite = addSprite(engine, entityContainer, 'danger')
    sprite.object.anchor.set(0.5)
    sprite.object.scale.set(0.5)
    engine.world.addComponent(
      entityContainer,
      new hadys.plugins.physics.components.Body(
        hadys.plugins.physics.Bodies.circle(50, 50, sprite.object.width / 2),
      ),
    )
    createFloor(engine)

    intervalId = window.setInterval(() => {
      engine.world.update()
    }, 16)
  })()

  return () => {
    clearInterval(intervalId)
  }

  function addMainSprite(
    engine: {
      world: hadys.ECS.World
      assets: import('d:/p/hadys-engine/lib/assets').Assets
    },
    rootEntity: number,
  ) {
    const entity = createContainer(engine, { x: 10, y: 10 })
    engine.world.addComponent(
      entity,
      new hadys.core.components.Hierarchy(rootEntity),
    )
    engine.world.addComponent(entity, new MovableTag())

    addSprite(engine, entity)
    addTitle(engine, entity)
    addFPSText(engine, entity)
  }

  function addSprite(
    engine: hadys.Engine,
    entity: number,
    name: string = 'logo',
  ) {
    const sprite = new hadys.plugins.render.Sprite(
      engine.assets.get(name) as any,
    )
    const spriteEntity = engine.world.addEntity()
    const display =
      new hadys.plugins.render.components.DisplayObject<hadys.plugins.render.Sprite>(
        sprite,
      )
    engine.world.addComponent(spriteEntity, display)
    engine.world.addComponent(
      spriteEntity,
      new hadys.core.components.Hierarchy(entity),
    )

    return display
  }

  function addTitle(engine: hadys.Engine, entity: number) {
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
  }

  function addFPSText(engine: hadys.Engine, entity: number) {
    const fpsText = new hadys.plugins.render.Text('0 FPS', {
      fontFamily: 'Arial',
      align: 'center',
      fontSize: 24,
      fill: 0xeeeeee,
    })
    fpsText.anchor.set(0.5)
    fpsText.position.set(500, 100)
    const textFPSEntity = engine.world.addEntity()
    engine.world.addComponent(
      textFPSEntity,
      new hadys.plugins.render.components.DisplayObject(fpsText),
    )
    engine.world.addComponent(
      textFPSEntity,
      new hadys.core.components.Hierarchy(entity),
    )
    engine.world.addComponent(textFPSEntity, new FPSTag())
  }

  function createContainer(
    engine: hadys.Engine,
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

  function createFloor(engine: hadys.Engine) {
    const entityContainer = createContainer(engine, { x: 0, y: 585 })
    const pos = engine.world
      .getComponents(entityContainer)!
      .get(hadys.core.components.Position)!

    const body = hadys.plugins.physics.Bodies.rectangle(0, 0, 800, 30, {
      isStatic: true,
    })
    engine.world.addComponent(
      entityContainer,
      new hadys.plugins.physics.components.Body(body),
    )

    const entity = engine.world.addEntity()
    engine.world.addComponent(
      entity,
      new hadys.core.components.Hierarchy(entityContainer),
    )
    const graphics = new hadys.plugins.render.Graphics()
    graphics.pivot.set(400, 15)
    graphics.beginFill(0xde3249)
    graphics.drawRect(0, 0, 800, 30)
    graphics.endFill()
    engine.world.addComponent(
      entity,
      new hadys.plugins.render.components.DisplayObject(graphics),
    )
    engine.world.update()
    return entity
  }
}
