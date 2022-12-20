import { ECS } from '../../ecs'
import { Dirty } from './Dirty'
import { DirtyComponent } from './extensions/dirties'
import { Vec2 } from './geometry'

export { DirtyComponent }

export class Rotation {
  public dirty = new Dirty()
  private _angle: number = 0

  public get angle(): number {
    return this._angle
  }

  constructor(angle: number = 0) {
    this._angle = angle
  }

  set(value: number) {
    this._angle = value
    this.dirty.mark()
  }

  setShadow(value: number) {
    this._angle = value
  }
}

export class Transform extends DirtyComponent {
  position: Vec2 = new Vec2()
  scale: Vec2 = new Vec2(1, 1)
  rotation: Rotation = new Rotation()

  get dirty(): boolean {
    return (
      this.position.dirty.is ||
      this.scale.dirty.is ||
      this.rotation.dirty.is ||
      super.dirty
    )
  }

  constructor(
    position: Vec2 = new Vec2(),
    scale: Vec2 = new Vec2(1, 1),
    rotation: Rotation = new Rotation(),
  ) {
    super()
    this.position = position
    this.scale = scale
    this.rotation = rotation
  }

  resetDirty(): void {
    this.position.dirty.reset()
    this.scale.dirty.reset()
    this.rotation.dirty.reset()
    super.resetDirty()
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
