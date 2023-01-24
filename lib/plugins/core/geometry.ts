export class Vec2 {
  private _x: number = 0

  public get x(): number {
    return this._x
  }

  private _y: number = 0
  public get y(): number {
    return this._y
  }

  static from(other: { x: number; y: number }): Vec2 {
    return new Vec2(other.x, other.y)
  }

  constructor(x: number = 0, y: number = 0) {
    this._x = x
    this._y = y
  }

  onChanged = () => {}

  set(x: number, y: number) {
    if (this._x === x && this._y === y) {
      return
    }
    this._x = x
    this._y = y
    this.onChanged()
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

  toString(): string {
    return `Vec2(${this._x}, ${this._y})`
  }

  clone(): Vec2 {
    return new Vec2(this._x, this._y)
  }
}
