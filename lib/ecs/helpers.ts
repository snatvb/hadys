import { ISystem } from './ISystem'

export const sortSystems = (systems: ISystem[]) => {
  const result: ISystem[] = [...systems]

  for (let index = 0; index < systems.length; index++) {
    const system = systems[index]
    if (system.sort.type === 'none') {
      continue
    }
    if (system.sort.type === 'before') {
      const systemMark = system.sort.system
      const indexBefore = result.findIndex((fn) => fn.type === systemMark)
      if (indexBefore === -1) {
        throw new Error(
          `System ${String(systemMark)} not found in ${result
            .map((s) => String(s.type))
            .join(', ')}`,
        )
      }
      if (index >= indexBefore) {
        result.splice(indexBefore, 0, system)
        result.splice(index + 1, 1)
      }
    } else if (system.sort.type === 'after') {
      const systemMark = system.sort.system
      const indexAfter = result.findIndex((fn) => fn.type === systemMark)
      if (indexAfter === -1) {
        throw new Error(
          `System ${String(systemMark)} not found in ${result
            .map((s) => String(s.type))
            .join(', ')}`,
        )
      }
      if (index <= indexAfter) {
        result.splice(indexAfter + 1, 0, system)
        result.splice(index, 1)
      }
    }
  }

  return result
}
