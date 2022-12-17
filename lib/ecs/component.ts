export abstract class Component {}
export class DirtyComponent {
  protected _dirty = false

  public get dirty(): boolean {
    return this._dirty
  }

  resetDirty(): void {
    this._dirty = false
  }

  protected _markDirty(): void {
    this._dirty = true
  }
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T
export type BaseComponentClass = ComponentClass<Component>
