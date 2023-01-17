export class Loop {
  _isRunning: boolean = false
  _rafId: number = 0

  get isRunning() {
    return this._isRunning
  }

  constructor(private _handler: () => void) {}

  start() {
    this._isRunning = true
    this._loop()
  }

  stop() {
    this._isRunning = false
    cancelAnimationFrame(this._rafId)
  }

  private _loop = () => {
    if (!this._isRunning) {
      return
    }

    this._handler()
    this._rafId = requestAnimationFrame(this._loop)
  }
}
