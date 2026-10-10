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

test('waits for duplicate starts of the same route to finish', async () => {
  startRouteProgress('/guide')
  startRouteProgress('/guide')

  finishRouteProgress('/guide')
  await wait(140)
  assert.equal(routeProgressPhase.value, 'loading')

  finishRouteProgress('/guide')
  await wait(140)
  assert.equal(routeProgressPhase.value, 'finishing')

  await wait(330)
  assert.equal(routeProgressPhase.value, 'idle')
})

test('restarting while finishing cancels the previous idle reset', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'] })

  startRouteProgress('/guide')
  finishRouteProgress('/guide')
  t.mock.timers.tick(120)
  assert.equal(routeProgressPhase.value, 'finishing')

  t.mock.timers.tick(100)
  startRouteProgress('/config')
  finishRouteProgress('/config')
  assert.equal(routeProgressPhase.value, 'loading')

  t.mock.timers.tick(119)
  assert.equal(routeProgressPhase.value, 'loading')
  t.mock.timers.tick(1)
  assert.equal(routeProgressPhase.value, 'finishing')

  // The previous route's reset would fire here without cancellation.
  t.mock.timers.tick(100)
  assert.equal(routeProgressPhase.value, 'finishing')
  t.mock.timers.tick(219)
  assert.equal(routeProgressPhase.value, 'finishing')
  t.mock.timers.tick(1)
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
