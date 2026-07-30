import assert from 'node:assert/strict'
import test from 'node:test'
import {
  finishRouteProgress,
  routeProgressPhase,
  startRouteProgress
} from '../src/route-progress'

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

test('tracks concurrent routes and completes before becoming idle', async () => {
  startRouteProgress('/guide')
  startRouteProgress('/api')
  assert.equal(routeProgressPhase.value, 'loading')

  finishRouteProgress('/guide')
  assert.equal(routeProgressPhase.value, 'loading')

  finishRouteProgress('/api')
  await wait(140)
  assert.equal(routeProgressPhase.value, 'finishing')

  await wait(330)
  assert.equal(routeProgressPhase.value, 'idle')
})

test('ignores unmatched completions and cancels a pending finish', async () => {
  finishRouteProgress('/same-page#heading')
  assert.equal(routeProgressPhase.value, 'idle')

  startRouteProgress('/guide')
  finishRouteProgress('/guide')
  startRouteProgress('/config')

  await wait(140)
  assert.equal(routeProgressPhase.value, 'loading')

  finishRouteProgress('/config')
  await wait(140)
  assert.equal(routeProgressPhase.value, 'finishing')

  await wait(330)
  assert.equal(routeProgressPhase.value, 'idle')
})
