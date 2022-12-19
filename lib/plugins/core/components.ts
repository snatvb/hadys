import { ECS } from '../../ecs'

export class Vec2 extends ECS.DirtyComponent {
  private _x: number = 0

  public get x(): number {
    return this._x
  }

  private _y: number = 0
  public get y(): number {
    return this._y
  }

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  set(x: number, y: number) {
    this._x = x
    this._y = y
    this._markDirty()
  }

  setShadow(x: number, y: number) {
    this._x = x
    this._y = y
  }

  magnitude(): number {
    return Math.sqrt(this._x * this._x + this._y * this._y)
  }

  normalize(): Vec2 {
    const magnitude = this.magnitude()
    return new Vec2(this._x / magnitude, this._y / magnitude)
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this._x + other.x, this._y + other.y)
  }

  subtract(other: Vec2): Vec2 {
    return new Vec2(this._x - other.x, this._y - other.y)
  }

  multiply(other: Vec2): Vec2 {
    return new Vec2(this._x * other.x, this._y * other.y)
  }
}

export class Transform extends Vec2 {}
export class Scale extends Vec2 {}

export class Rotation extends ECS.DirtyComponent {
  private _angle: number = 0

  public get angle(): number {
    return this._angle
  }

  constructor(angle: number) {
    super()
    this._angle = angle
  }

  set(value: number) {
    this._angle = value
    this._markDirty()
  }

  setShadow(value: number) {
    this._angle = value
  }
}
