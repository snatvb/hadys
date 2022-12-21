import { hadys } from '../lib/main'

class FPSTag extends hadys.ECS.Component {}
class MovableTag extends hadys.ECS.Component {}

class TimeToRemove extends hadys.ECS.Component {
  public alive = 0
  constructor(public target: number) {
    super()
  }
}

const worldTimeFilter = new hadys.ECS.Filter([
  new hadys.ECS.Includes([
    hadys.core.components.WorldTimeTag,
    hadys.core.components.Time,
  ]),
])

const readWorldTime = (filter: typeof worldTimeFilter) => {
  const worldTime = filter.first()!
  return worldTime.components.get(hadys.core.components.Time)!
}

class RemoveByTimeSystem extends hadys.ECS.System('RemoveByTimeSystem') {
  _filters = {
    worldTime: worldTimeFilter,
    timeToRemove: new hadys.ECS.Filter([
      new hadys.ECS.Includes([TimeToRemove]),
    ]),
  }

  update() {
    const worldTime = readWorldTime(this._filters.worldTime)
    for (const filter of this._filters.timeToRemove) {
      const timeToRemove = filter.components.get(TimeToRemove)!
      timeToRemove.alive += worldTime.delta
      if (timeToRemove.alive > timeToRemove.target) {
        this.world.removeEntity(filter.entity)
      }
    }
  }
}

class SimpleMoveSystem extends hadys.ECS.System('SimpleMoveSystem') {
  _filters = {
    transforms: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.core.components.Transform, MovableTag]),
    ]),
  }

  update() {
    for (const filter of this._filters.transforms) {
      const { position } = filter.components.get(
        hadys.core.components.Transform,
      )!
      if (position.x === 0) {
        continue
      }
      position.set((position.x + 2) % 100, (position.y + 2) % 100)
    }
  }
}

class CollisionSystem extends hadys.ECS.System('CollisionSystem') {
  _filters = {
    bodies: new hadys.ECS.Filter([
      new hadys.ECS.Includes([hadys.plugins.physics.components.Body]),
    ]),
  }

  private _collisions!: hadys.plugins.physics.extensions.CollisionDetector

  init() {
    super.init()
    this._collisions = this.world.getExtension(
      hadys.plugins.physics.extensions.CollisionDetector,
    )
  }

  update() {
    for (const event of this._collisions.collisions.start) {
      const [a] = event.pairs
      const { vertex } = a.contacts[a.contacts.length - 1]
      this._createHit(vertex)
    }
  }

  private _createHit(position: { x: number; y: number }) {
    const entityContainer = createContainer(this.world, position)
    this.world.addComponent(entityContainer, new TimeToRemove(1000))

    const graphicEntity = this.world.addEntity()
    const graphics = new hadys.plugins.render.Graphics()
    graphics.beginFill(0xff0000)
    graphics.drawCircle(0, 0, 10)
    graphics.endFill()
    graphics.pivot.set(5, 5)
    this.world.addComponent(
      graphicEntity,
      new hadys.plugins.render.components.DisplayObject(graphics),
    )
    this.world.addComponent(
      graphicEntity,
      new hadys.core.components.Hierarchy(entityContainer),
    )
  }
}

class FPSDisplaySystem extends hadys.ECS.System('FPSDisplaySystem') {
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

function createContainer(
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
