import { hadys } from '../../lib/main'

export const worldTimeFilter = new hadys.ECS.Filter([
  new hadys.ECS.Includes([
    hadys.core.components.WorldTimeTag,
    hadys.core.components.Time,
  ]),
])

export const readWorldTime = (filter: typeof worldTimeFilter) => {
  const worldTime = filter.first()!
  return worldTime.components.get(hadys.core.components.Time)!
}
