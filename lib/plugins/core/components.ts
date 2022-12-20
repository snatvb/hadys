import { ECS } from '../../ecs'
import { Dirty } from './Dirty'
import { DirtyComponent } from './extensions/dirties'
import { Vec2 } from './geometry'

export { DirtyComponent }

export class Rotation {
  private _angleRad: number = 0

  public get angle(): number {
    return this._angleRad
  }

  public get angleDeg(): number {
    return (this._angleRad * 180) / Math.PI
  }

  constructor(angleRad: number = 0) {
    this._angleRad = angleRad
  }

  onChanged = () => {}

  set(value: number) {
    if (this._angleRad === value) {
      return
    }
    this._angleRad = value
    this.onChanged()
  }

  setShadow(value: number) {
    this._angleRad = value
  }
}

export class Transform extends DirtyComponent {
  position: Vec2 = new Vec2()
  scale: Vec2 = new Vec2(1, 1)
  rotation: Rotation = new Rotation()

  constructor(
    position: Vec2 = new Vec2(),
    scale: Vec2 = new Vec2(1, 1),
    rotation: Rotation = new Rotation(),
  ) {
    super()
    this.position = position
    this.scale = scale
    this.rotation = rotation

    const markDirty = this._markDirty.bind(this)
    this.position.onChanged = markDirty
    this.scale.onChanged = markDirty
    this.rotation.onChanged = markDirty
  }
}

export class Hierarchy extends ECS.Component {
  children: Set<ECS.Entity> = new Set()
  constructor(public parent: ECS.Entity | null = null) {
    super()
  }

  addChild(child: ECS.Entity) {
    this.children.add(child)
  }

  removeChild(child: ECS.Entity) {
    this.children.delete(child)
  }
}

export class Time extends ECS.Component {
  elapsed: number = 0
  delta: number = 0

  get deltaSeconds() {
    return this.delta / 1000
  }

  constructor(
    public started: number = performance.now(),
    public lastUpdate = started,
  ) {
    super()
  }
}

export class WorldTimeTag extends ECS.Component {}
