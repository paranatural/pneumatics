export interface Service {
  start: () => Promise<void> | void
  isWorking: () => boolean
  stop: () => Promise<void> | void
}
