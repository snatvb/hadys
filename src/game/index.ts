import { hadys } from '../../lib/main'
import { CollisionSystem } from './CollisionSystem'
import { FPSTag, MovableTag } from './components'
import { FPSDisplaySystem } from './FPSDisplaySystem'
import { RemoveByTimeSystem } from './RemoveByTimeSystem'
import { SimpleMoveSystem } from './SimpleMoveSystem'

export function startGame(viewContainer: HTMLDivElement) {
  const api = { clear: () => {} }
  ;(async () => {
    const engine = hadys.create()
    const corePlugin = hadys.plugins.core.create()
    const physicsPlugin = hadys.plugins.physics.create({ engine: {} })
    const renderPlugin = hadys.plugins.render.create(engine, {
      size: {
        width: 800,
        height: 600,
      },
      resolution: 2,
    })

    const view = renderPlugin.app.view as HTMLCanvasElement
    view.style.background = 'transparent'
    view.style.width = '100%'
    view.style.height = '100%'
    viewContainer.appendChild(renderPlugin.app.view as HTMLCanvasElement)
    const debugPlugin = hadys.plugins.debug.create(
      physicsPlugin.engine,
      renderPlugin.app,
    )

    engine.world.setExtensions([
      ...corePlugin.extensions,
      ...physicsPlugin.extensions,
      ...renderPlugin.extensions,
    ])
    engine.world.setSystems([
      ...physicsPlugin.systems,
      new CollisionSystem(),
      new SimpleMoveSystem(),
      new FPSDisplaySystem(),
      ...corePlugin.systems,
      ...renderPlugin.systems,
      ...debugPlugin.systems,
      new RemoveByTimeSystem(),
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
    engine.world.addComponent(rootEntity, new hadys.core.components.Hierarchy())
    addMainSprite(engine, rootEntity)

    addDangerCircle(engine, { x: 100, y: 100 })
    addDangerCircle(engine, { x: 70, y: 200 })
    addDangerCircle(engine, { x: 300, y: 200 })
    addDangerCircle(engine, { x: 500, y: 200 })
    addDangerCircle(engine, { x: 300, y: 100 })

    for (let i = 0; i < 10; i++) {
      addDangerCircle(engine, { x: i * 60 + 100, y: 0 })
    }
    createFloor(engine)

    const intervalId = window.setInterval(() => {
      engine.world.update()
    }, 16)
    api.clear = () => {
      clearInterval(intervalId)
      engine.world.destroy()
    }
  })()

  return api
}

function addDangerCircle(
  engine: hadys.Engine,
  position: { x: number; y: number },
) {
  const entityContainer = createContainer(engine.world, position)

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
      hadys.plugins.physics.Bodies.circle(50, 50, sprite.object.width / 2, {
        friction: 2,
        restitution: 0.5,
      }),
    ),
  )
  addFPSText(engine, entityContainer, [0, -sprite.object.width / 2 - 10])
}

function addMainSprite(engine: hadys.Engine, rootEntity: number) {
  const entity = createContainer(engine.world, { x: 10, y: 10 })
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
  const sprite = new hadys.plugins.render.Sprite(engine.assets.get(name) as any)
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

function addFPSText(
  engine: hadys.Engine,
  entity: number,
  [x, y]: number[] = [500, 100],
) {
  const fpsText = new hadys.plugins.render.Text('0 FPS', {
    fontFamily: 'Arial',
    align: 'center',
    fontSize: 24,
    fill: 0xeeeeee,
  })
  fpsText.anchor.set(0.5)
  fpsText.position.set(x, y)
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

export function createContainer(
  world: hadys.ECS.IWorld,
  position: { x: number; y: number },
) {
  const entity = world.addEntity()
  world.addComponent(entity, new hadys.core.components.Hierarchy())
  world.addComponent(entity, new hadys.plugins.render.components.Container())
  const transformPosition = hadys.core.geometry.Vec2.from(position)
  world.addComponent(
    entity,
    new hadys.core.components.Transform(transformPosition),
  )

  return entity
}

function createFloor(engine: hadys.Engine) {
  const entityContainer = createContainer(engine.world, { x: 400, y: 585 })
  engine.world
    .getComponents(entityContainer)!
    .get(hadys.core.components.Transform)!

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
