"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Code, Lightbulb, Target, CheckCircle, ArrowRight } from "lucide-react"

/**
 * EDUCATIONAL NOTE: Mentoring Guide Component
 *
 * This component provides a comprehensive guide for mentors to use when teaching
 * React, JavaScript, and web development concepts through this project.
 */

export function MentoringGuide() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8" />
          Student Management Dashboard - Mentoring Guide
        </h1>
        <p className="text-muted-foreground">A comprehensive guide for teaching modern React and JavaScript concepts</p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            This Student Management Dashboard is designed as a comprehensive learning project that demonstrates
            essential React and JavaScript concepts through practical, real-world scenarios. The application showcases
            modern development patterns, performance optimization techniques, and best practices that every React
            developer should understand.
          </p>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Teaching Approach:</strong> Each concept is demonstrated through working code with extensive
              comments, interactive examples, and practical applications that students can see in action.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Core Concepts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Core Concepts Demonstrated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Async/Await */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Async/Await</Badge>
              <h3 className="font-semibold">Asynchronous JavaScript Patterns</h3>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <p>
                <strong>Where to find it:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>lib/mock-api.ts</code> - Mock API service with realistic async operations
                </li>
                <li>
                  <code>components/student-form.tsx</code> - Async form validation and submission
                </li>
                <li>
                  <code>components/async-patterns-demo.tsx</code> - Interactive async demonstrations
                </li>
                <li>
                  <code>app/page.tsx</code> - Data loading with proper error handling
                </li>
              </ul>
              <p>
                <strong>Key Learning Points:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Sequential vs Parallel execution (Promise.all vs individual awaits)</li>
                <li>Error handling with try-catch blocks and Promise.catch()</li>
                <li>Loading states and user feedback during async operations</li>
                <li>Debouncing async operations to prevent excessive API calls</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Event Loop */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Event Loop</Badge>
              <h3 className="font-semibold">JavaScript Event Loop & Task Queues</h3>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <p>
                <strong>Where to find it:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>components/async-patterns-demo.tsx</code> - Interactive event loop visualization
                </li>
                <li>
                  <code>app/page.tsx</code> - demonstrateEventLoop function with console logging
                </li>
                <li>
                  <code>lib/mock-api.ts</code> - setTimeout usage for network simulation
                </li>
              </ul>
              <p>
                <strong>Key Learning Points:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Call Stack execution order (synchronous code first)</li>
                <li>Microtask queue priority (Promises, queueMicrotask)</li>
                <li>Macrotask queue execution (setTimeout, setInterval)</li>
                <li>How React's rendering fits into the event loop</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* State Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">State Management</Badge>
              <h3 className="font-semibold">React State & Performance Optimization</h3>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <p>
                <strong>Where to find it:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>app/page.tsx</code> - useState, useEffect, useMemo, useCallback usage
                </li>
                <li>
                  <code>components/student-list.tsx</code> - Optimized filtering and search
                </li>
                <li>
                  <code>hooks/use-debounce.ts</code> - Custom hook for performance optimization
                </li>
                <li>
                  <code>hooks/use-local-storage.ts</code> - Persistent state management
                </li>
              </ul>
              <p>
                <strong>Key Learning Points:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>When to use useMemo vs useCallback for optimization</li>
                <li>Preventing unnecessary re-renders with proper dependencies</li>
                <li>Custom hooks for reusable stateful logic</li>
                <li>Local storage integration with React state</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Controlled Components */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Forms</Badge>
              <h3 className="font-semibold">Controlled Components & Form Validation</h3>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <p>
                <strong>Where to find it:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>components/student-form.tsx</code> - Comprehensive form with validation
                </li>
                <li>
                  <code>types/student.ts</code> - TypeScript interfaces for type safety
                </li>
              </ul>
              <p>
                <strong>Key Learning Points:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Controlled vs uncontrolled components</li>
                <li>Real-time validation with immediate user feedback</li>
                <li>Async validation (email checking) with debouncing</li>
                <li>File upload handling with preview functionality</li>
                <li>Form submission with loading states and error handling</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Performance */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Performance</Badge>
              <h3 className="font-semibold">Performance Monitoring & Optimization</h3>
            </div>
            <div className="pl-4 space-y-2 text-sm">
              <p>
                <strong>Where to find it:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>hooks/use-performance-monitor.ts</code> - Custom performance tracking
                </li>
                <li>
                  <code>components/performance-monitor.tsx</code> - Real-time performance display
                </li>
                <li>
                  <code>hooks/use-debounce.ts</code> - Debouncing for performance
                </li>
              </ul>
              <p>
                <strong>Key Learning Points:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Measuring component render performance</li>
                <li>Memory usage monitoring</li>
                <li>FPS tracking for smooth user experience</li>
                <li>Identifying performance bottlenecks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Teaching Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Hands-on Learning
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Interactive demos in the Analytics tab</li>
                <li>• Real-time execution logs showing concept flow</li>
                <li>• Performance monitoring with live metrics</li>
                <li>• Practical examples with immediate feedback</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Code-First Approach
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Every concept demonstrated in working code</li>
                <li>• Extensive inline comments explaining "why"</li>
                <li>• TypeScript for better learning experience</li>
                <li>• Modern React patterns and best practices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Suggested Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                1
              </Badge>
              <div>
                <h4 className="font-medium">Start with Basic React Concepts</h4>
                <p className="text-sm text-muted-foreground">
                  Explore the Student List component to understand JSX, props, and basic state management.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                2
              </Badge>
              <div>
                <h4 className="font-medium">Dive into Forms and Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Study the Student Form to learn controlled components, validation patterns, and user experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                3
              </Badge>
              <div>
                <h4 className="font-medium">Understand Async Patterns</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Interactive Async Demos to visualize how JavaScript handles asynchronous operations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                4
              </Badge>
              <div>
                <h4 className="font-medium">Explore Performance Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Examine custom hooks and performance monitoring to understand React optimization techniques.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                5
              </Badge>
              <div>
                <h4 className="font-medium">Practice with Real Scenarios</h4>
                <p className="text-sm text-muted-foreground">
                  Modify the application, add new features, and experiment with different patterns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment & Discussion Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Technical Understanding</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Can explain the difference between microtasks and macrotasks</li>
                <li>• Understands when to use useMemo vs useCallback</li>
                <li>• Can implement proper error handling in async functions</li>
                <li>• Knows how to optimize React component re-renders</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Practical Application</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Can build forms with proper validation</li>
                <li>• Implements responsive design patterns</li>
                <li>• Uses TypeScript effectively for type safety</li>
                <li>• Applies performance optimization techniques</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This project serves as a comprehensive learning resource for modern React development. Each component and
              pattern is carefully crafted to demonstrate best practices and real-world scenarios.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js 15, React 18, TypeScript, and Tailwind CSS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
