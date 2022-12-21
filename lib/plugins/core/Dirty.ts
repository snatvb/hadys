export class Dirty {
  protected _dirty = true

  public get is(): boolean {
    return this._dirty
  }

  reset(): void {
    this._dirty = false
  }

  mark(): void {
    this._dirty = true
  }
}
