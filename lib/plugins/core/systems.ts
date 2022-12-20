import { ECS } from '../../ecs'

export class System extends ECS.System('Hadys::ResetDirtiesSystem') {
  _filters = {}

  update() {}
}
