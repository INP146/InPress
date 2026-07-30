import { readonly, ref } from 'vue'

export type RouteProgressPhase = 'idle' | 'loading' | 'finishing'

const phase = ref<RouteProgressPhase>('idle')
const pendingRoutes = new Map<string, number>()
let finishTimer: ReturnType<typeof setTimeout> | undefined
let resetTimer: ReturnType<typeof setTimeout> | undefined
let startedAt = 0

export const routeProgressPhase = readonly(phase)

export function startRouteProgress(route: string): void {
  pendingRoutes.set(route, (pendingRoutes.get(route) ?? 0) + 1)

  if (finishTimer !== undefined) {
    clearTimeout(finishTimer)
    finishTimer = undefined
  }

  if (resetTimer !== undefined) {
    clearTimeout(resetTimer)
    resetTimer = undefined
  }

  if (phase.value !== 'loading') startedAt = Date.now()
  phase.value = 'loading'
}

export function finishRouteProgress(route: string): void {
  const count = pendingRoutes.get(route)
  if (count === undefined) return

  if (count > 1) pendingRoutes.set(route, count - 1)
  else pendingRoutes.delete(route)

  if (pendingRoutes.size > 0) return

  const remainingVisibleTime = Math.max(0, 120 - (Date.now() - startedAt))
  finishTimer = setTimeout(() => {
    finishTimer = undefined
    if (pendingRoutes.size > 0) return

    phase.value = 'finishing'
    resetTimer = setTimeout(() => {
      resetTimer = undefined
      if (pendingRoutes.size === 0) phase.value = 'idle'
    }, 320)
  }, remainingVisibleTime)
}
