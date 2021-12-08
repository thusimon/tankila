/* author Sean Bradley */
export class tween {
  Tween: typeof Tween
  update(time?: number): boolean
  getAll(): Tween[]
  removeAll(): void
  add(tween: Tween): void
  remove(tween: Tween): void
  Easing: {
      Linear: {
          None: (amount: number) => number
      }
      Quadratic: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Cubic: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Quartic: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Quintic: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Sinusoidal: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Exponential: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Circular: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Elastic: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Back: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
      Bounce: {
          In: (amount: number) => number
          Out: (amount: number) => number
          InOut: (amount: number) => number
      }
  }
}
declare type EasingFunction = (amount: number) => number
declare class Tween {
  constructor(object: unknown)
  isPlaying(): boolean
  isPaused(): boolean
  to(properties: unknown, duration?: number): this
  duration(value: number): this
  start(time?: number | string): this
  stop(): this
  end(): this
  pause(time: number): this
  resume(time: number): this
  delay(amount: number): this
  repeat(times: number): this
  repeatDelay(amount: number): this
  onStart(callback: (object: unknown) => void): this
  onUpdate(callback: (object: unknown, elapsed: number) => void): this
  onRepeat(callback: (object: unknown) => void): this
  onComplete(callback: (object: unknown) => void): this
  onStop(callback: (object: unknown) => void): this
  easing(easing: EasingFunction): this
}

declare const TWEEN: tween
