export type LoopKind =
  | {
      type: 'RequestAnimationFrame'
    }
  | {
      type: 'Timeout'
      interval: number
    }

export class Loop {
  _isRunning: boolean = false
  _rafId: number = 0
  _timeoutId: number | NodeJS.Timeout = 0

  get isRunning() {
    return this._isRunning
  }

  static timeout(handler: () => void, interval = 1000 / 60) {
    return new Loop(handler, { type: 'Timeout', interval })
  }

  constructor(
    private _handler: () => void,
    public readonly kind: LoopKind = { type: 'RequestAnimationFrame' },
  ) {}

  start() {
    this._isRunning = true
    this._loop()
  }

  stop() {
    this._isRunning = false
    if (this.kind.type === 'Timeout') {
      clearTimeout(this._timeoutId as NodeJS.Timeout)
    } else {
      cancelAnimationFrame(this._rafId)
    }
  }

  private _loop = () => {
    if (!this._isRunning) {
      return
    }

    this._handler()
    if (this.kind.type === 'Timeout') {
      this._timeoutId = setTimeout(this._loop, this.kind.interval)
    } else {
      this._rafId = requestAnimationFrame(this._loop)
    }
  }
}
