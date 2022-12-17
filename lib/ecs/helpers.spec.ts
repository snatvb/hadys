import { sortSystems } from './helpers'
import { ISystem } from './ISystem'
import { System } from './System'

class SystemA extends System(Symbol('a')) implements ISystem {
  update() {}
}

class SystemB extends System(Symbol('b')) implements ISystem {
  sort = { type: 'after', system: SystemA.Type } as const
  update() {}
}

class SystemC extends System(Symbol('c')) implements ISystem {
  sort = { type: 'after', system: SystemB.Type } as const
  update() {}
}

class SystemD extends System(Symbol('d')) implements ISystem {
  sort = { type: 'before', system: SystemA.Type } as const
  update() {}
}

class SystemE extends System(Symbol('e')) implements ISystem {
  sort = { type: 'before', system: SystemD.Type } as const
  update() {}
}

class SystemF extends System(Symbol('f')) implements ISystem {
  sort = { type: 'after', system: SystemE.Type } as const
  update() {}
}

describe('suite name', () => {
  it('foo', () => {
    expect(1 + 1).toEqual(2)
    expect(true).toBe(true)
  })
})

describe('sort systems', () => {
  const system1 = new SystemA()
  const system2 = new SystemB()
  const system3 = new SystemC()
  const system4 = new SystemD()
  const system5 = new SystemE()
  const system6 = new SystemF()

  it('should sort 2 systems', () => {
    const systems = [system2, system1]
    const sorted = sortSystems(systems)
    expect(sorted.map((s) => s.type)).toEqual(
      [system1, system2].map((s) => s.type),
    )
  })

  it('should sort 4 systems', () => {
    const systems = [system3, system1, system2, system4]
    const sorted = sortSystems(systems)
    expect(sorted.map((s) => s.type)).toEqual(
      [system4, system1, system2, system3].map((s) => s.type),
    )
  })

  it('should sort 6 systems', () => {
    const systems = [system3, system5, system6, system1, system2, system4]
    const sorted = sortSystems(systems)
    expect(sorted.map((s) => s.type)).toEqual(
      [system5, system6, system4, system1, system2, system3].map(
        (s) => s.type,
      ),
    )
  })
})
