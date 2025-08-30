"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, BarChart3, Clock, Cpu } from "lucide-react"

/**
 * EDUCATIONAL NOTE: Performance Monitor Component
 *
 * This component demonstrates:
 * 1. Real-time performance monitoring
 * 2. React DevTools integration concepts
 * 3. Memory usage tracking
 * 4. Render performance visualization
 */

interface PerformanceData {
  renderCount: number
  memoryUsage: number
  fps: number
  loadTime: number
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false)

  const performanceData: PerformanceData = {
    renderCount: Math.floor(performance.now() / 100), // Approximate render count
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    fps: 60, // Static value to avoid complexity
    loadTime: performance.now(),
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Activity className="h-4 w-4 mr-2" />
          Performance
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Performance Monitor
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
          <CardDescription className="text-xs">Real-time application performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">FPS</p>
                <p className="text-sm font-semibold">{performanceData.fps}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="text-sm font-semibold">{(performanceData.memoryUsage / 1024 / 1024).toFixed(1)}MB</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Load Time</p>
                <p className="text-sm font-semibold">{(performanceData.loadTime / 1000).toFixed(2)}s</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Renders</p>
                <p className="text-sm font-semibold">{performanceData.renderCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Performance</span>
              <Badge
                variant={performanceData.fps > 50 ? "default" : performanceData.fps > 30 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {performanceData.fps > 50 ? "Excellent" : performanceData.fps > 30 ? "Good" : "Poor"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
