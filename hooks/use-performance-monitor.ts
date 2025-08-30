"use client"

import { useRef } from "react"

/**
 * EDUCATIONAL NOTE: Performance Monitoring Hook
 *
 * This hook demonstrates:
 * 1. Performance measurement techniques
 * 2. Component render tracking
 * 3. Ref-based counters to avoid infinite loops
 * 4. Custom hook for development tools
 */

interface PerformanceMetrics {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  memoryUsage?: number
}

export function usePerformanceMonitor(componentName: string): PerformanceMetrics {
  const renderCount = useRef(0)
  const renderTimes = useRef<number[]>([])
  const startTime = useRef<number>(performance.now())

  // Calculate render time
  const endTime = performance.now()
  const renderTime = endTime - startTime.current

  // Update counters
  renderCount.current += 1
  renderTimes.current.push(renderTime)

  // Keep only last 10 render times for average calculation
  if (renderTimes.current.length > 10) {
    renderTimes.current.shift()
  }

  // Calculate average
  const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length

  // Get memory usage if available
  const memoryUsage = (performance as any).memory?.usedJSHeapSize

  // Log performance in development (throttled)
  if (process.env.NODE_ENV === "development" && renderCount.current % 10 === 0) {
    console.log(`[Performance] ${componentName}:`, {
      renderCount: renderCount.current,
      renderTime: `${renderTime.toFixed(2)}ms`,
      averageRenderTime: `${averageRenderTime.toFixed(2)}ms`,
      memoryUsage: memoryUsage ? `${(memoryUsage / 1024 / 1024).toFixed(2)}MB` : "N/A",
    })
  }

  // Reset start time for next render
  startTime.current = performance.now()

  return {
    renderCount: renderCount.current,
    lastRenderTime: renderTime,
    averageRenderTime,
    memoryUsage,
  }
}
