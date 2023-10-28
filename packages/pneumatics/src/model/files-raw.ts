import fs from 'node:fs/promises'
import path from 'node:path'

import { createEffect, createEvent, createStore } from 'effector'

import { config } from '../shared/config'

interface FileRaw {
  pathRelative: string
  content: string
}

const filesRawStore = createStore<Map<string, FileRaw>>(new Map())

const filesRawAdd = createEffect<string, FileRaw>(async (pathRelative) => {
  const buffer = await fs.readFile(path.join(config.cwd, config.path, pathRelative))
  return {
    pathRelative,
    content: buffer.toString()
  }
})
filesRawStore.on(filesRawAdd.doneData, (state, payload) => {
  if (!state.has(payload.pathRelative)) {
    state.set(payload.pathRelative, payload)
    return new Map(state)
  }
  else return state
})

const filesRawChange = createEffect<string, FileRaw>(async (pathRelative) => {
  const buffer = await fs.readFile(path.join(config.cwd, config.path, pathRelative))
  return {
    pathRelative,
    content: buffer.toString()
  }
})
filesRawStore.on(filesRawChange.doneData, (state, payload) => {
  if (!state.has(payload.pathRelative)) {
    state.set(payload.pathRelative, payload)
    return new Map(state)
  }
  else return state
})

const filesRawRemove = createEvent<string>()
filesRawStore.on(filesRawRemove, (state, pathRelative) => {
  if (state.has(pathRelative)) {
    state.delete(pathRelative)
    return new Map(state)
  }
  else return state
})

export const filesRaw = {
  store: filesRawStore,
  add: filesRawAdd,
  change: filesRawChange,
  remove: filesRawRemove,
}
