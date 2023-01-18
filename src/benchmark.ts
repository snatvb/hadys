import { hadys } from '../lib/main'

class Position extends hadys.core.components.DirtyComponent {
  private _x: number = 0
  private _y: number = 0

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }

  public set x(value: number) {
    if (this._x === value) {
      return
    }
    this._markDirty()
    this._x = value
  }

  public set y(value: number) {
    if (this._y === value) {
      return
    }
    this._markDirty()
    this._y = value
  }
}

class AliveTimer extends hadys.ECS.Component {
  public ticks: number = 0

  public update(): void {
    this.ticks++
  }
}

class Any extends hadys.ECS.Component {}

class SystemMove extends hadys.ECS.System(Symbol('test')) {
  _filters = {
    positions: new hadys.ECS.Filter([new hadys.ECS.Includes([Position])]),
  }

  update() {
    for (const filter of this._filters.positions) {
      const component = filter.components.get(Position)!
      if (component.x === 0 || component.x >= 200) {
        continue
      }
      component.x += 50
      component.y += 2
    }
  }
}
class SystemBack extends hadys.ECS.System(Symbol('test')) {
  _filters = {
    positions: new hadys.ECS.Filter([new hadys.ECS.Includes([Position])]),
  }
  counter = 0

  update() {
    this.counter++
    for (const filter of this._filters.positions) {
      if (this.counter % 10 === 0) {
        const component = filter.components.get(Position)!
        component.x = 0
        component.y = 0
      }
    }
  }
}

class SystemLogger extends hadys.ECS.System(Symbol('logger')) {
  _filters = {
    positions: new hadys.ECS.Filter([new hadys.ECS.Includes([Position])]),
  }

  sort = { type: 'after', system: SystemMove.Type } as const

  update() {
    for (const filter of this._filters.positions) {
      const component = filter.components.get(Position)!
      if (component.x === 0) {
        continue
      }
    }
  }
}

class SystemCounter extends hadys.ECS.System(Symbol('counter')) {
  static count = 0
  _filters = {
    any: new hadys.ECS.Filter([new hadys.ECS.Includes([Any])]),
  }
  sort = { type: 'after', system: SystemMove.Type } as const

  update() {
    for (const _ of this._filters.any) {
      SystemCounter.count++
    }
  }
}

class ReCreateSystem extends hadys.ECS.System(Symbol('reset')) {
  static recreateCount = 0
  _filters = {
    alive: new hadys.ECS.Filter([new hadys.ECS.Includes([AliveTimer])]),
  }

  update() {
    let removed = 0
    for (const filter of this._filters.alive) {
      const alive = filter.components.get(AliveTimer)!
      alive.update()
      if (alive.ticks > 100) {
        removed++
        this.world.removeEntity(filter.entity)
      }
    }
    for (let i = 0; i < removed; i++) {
      createSomeEntity(this.world)
      ReCreateSystem.recreateCount++
    }
  }
}

function formatNumber(num: number) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

const bench = (fn: () => void) => {
  const start = performance.now()
  const target = start + 1000
  while (performance.now() < target) {
    fn()
  }
}

const benchAmount = () => {
  const start = performance.now()
  const target = start + 1000
  let amount = 0
  while (performance.now() < target) {
    amount++
  }
  return amount
}

const benchmark = () => {
  ReCreateSystem.recreateCount = 0
  const engine = hadys.create()
  const corePlugin = hadys.plugins.core.create()
  const renderPlugin = hadys.plugins.render.create(engine, {
    width: 800,
    height: 600,
    view: document.createElement('canvas'),
  })
  const physicsPlugin = hadys.plugins.physics.create()
  engine.world.setExtensions([...corePlugin.extensions])
  engine.world.setSystems([
    ...corePlugin.systems,
    new SystemCounter(),
    new SystemMove(),
    new SystemBack(),
    new ReCreateSystem(),
    ...renderPlugin.systems,
    ...physicsPlugin.systems,
  ])
  for (let i = 0; i < 1000; i++) {
    createSomeEntity(engine.world)
  }
  for (let i = 0; i < 1000; i++) {
    const entity = engine.world.addEntity()
    engine.world.addComponent(entity, new Any())
  }

  // engine.world.update()
  bench(engine.world.update.bind(engine.world))
  console.log(`ECS Updates: ${formatNumber(SystemCounter.count)} ops/sec`)
  console.log(`ECS Recreate: ${formatNumber(ReCreateSystem.recreateCount)}`)
}

export const run = () => {
  console.log('run...')
  const engine = hadys.create()
  engine.world.setSystems([new SystemLogger(), new SystemMove()])
  const entity = createSomeEntity(engine.world)
  for (let i = 0; i < 50; i++) {
    createSomeEntity(engine.world)
  }
  const component = engine.world.getComponents(entity)?.get(Position)!
  component.x = 100
  const entity2 = engine.world.addEntity()
  engine.world.addComponent(entity2, new Position())
  // const id = setInterval(() => {
  //   engine.world.update()
  // }, 16)

  benchmark()

  // return () => {
  //   clearInterval(id)
  // }
}
function createSomeEntity(world: hadys.ECS.IWorld) {
  const entity = world.addEntity()
  const component = new Position()
  component.x = Math.random() > 0.5 ? 100 : 0
  world.addComponent(entity, component)
  world.addComponent(entity, new Any())
  world.addComponent(entity, new AliveTimer())
  return entity
}
