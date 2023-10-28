import { Service } from '../shared/service'
import { Scanner } from '../services/scanner'
// import { Server } from '../services/server'

import '../model/entities'

export class App implements Service {
  private services: Array<Service>
  private isWorkingState: boolean = false

  constructor() {
    this.services = [
      new Scanner(),
      // new Server(),
    ]
  }

  async start() {
    await Promise.all(this.services.map(s => s.start()))
    this.isWorkingState = true
  }

  isWorking() {
    return this.isWorkingState
  }

  async stop() {
    await Promise.all(this.services.map(s => s.stop()))
    this.isWorkingState = false
  }
}
