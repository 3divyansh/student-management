"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, RotateCcw, Clock, Zap, AlertCircle, CheckCircle } from "lucide-react"

/**
 * EDUCATIONAL NOTE: Async Patterns and Event Loop Demo
 *
 * This component provides interactive demonstrations of:
 * 1. JavaScript Event Loop mechanics
 * 2. Async/Await patterns and best practices
 * 3. Promise handling and error management
 * 4. Microtasks vs Macrotasks
 * 5. Sequential vs Parallel execution
 * 6. Real-world async scenarios
 */

interface LogEntry {
  id: number
  message: string
  type: "sync" | "microtask" | "macrotask" | "async" | "error"
  timestamp: number
}

export function AsyncPatternsDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentDemo, setCurrentDemo] = useState<string | null>(null)
  const logIdRef = useRef(0)

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    const logEntry: LogEntry = {
      id: logIdRef.current++,
      message,
      type,
      timestamp: performance.now(),
    }
    setLogs((prev) => [...prev, logEntry])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    logIdRef.current = 0
  }, [])

  /**
   * EDUCATIONAL NOTE: Event Loop Demonstration
   * This function shows the order of execution for different types of tasks
   */
  const demonstrateEventLoop = useCallback(async () => {
    setIsRunning(true)
    setCurrentDemo("event-loop")
    clearLogs()

    addLog("🚀 Starting Event Loop Demo", "sync")

    // Synchronous code
    addLog("1. Synchronous operation (Call Stack)", "sync")

    // Microtask (Promise.resolve)
    Promise.resolve().then(() => {
      addLog("3. Microtask (Promise.resolve) - High Priority", "microtask")
    })

    // Another microtask
    queueMicrotask(() => {
      addLog("4. queueMicrotask - Also High Priority", "microtask")
    })

    // Macrotask (setTimeout)
    setTimeout(() => {
      addLog("5. Macrotask (setTimeout 0ms) - Lower Priority", "macrotask")
    }, 0)

    // Another setTimeout with delay
    setTimeout(() => {
      addLog("6. Macrotask (setTimeout 10ms) - Even Later", "macrotask")
    }, 10)

    // More synchronous code
    addLog("2. More synchronous code (Call Stack)", "sync")

    // Wait for all async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 50))
    setIsRunning(false)
  }, [addLog, clearLogs])

  /**
   * EDUCATIONAL NOTE: Sequential vs Parallel Async Operations
   * This demonstrates the performance difference between sequential and parallel execution
   */
  const demonstrateSequentialVsParallel = useCallback(async () => {
    setIsRunning(true)
    setCurrentDemo("sequential-parallel")
    clearLogs()

    // Mock async function that simulates API call
    const mockApiCall = (name: string, delay: number): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          addLog(`✅ ${name} completed (${delay}ms)`, "async")
          resolve(`${name} result`)
        }, delay)
      })
    }

    addLog("🔄 Starting Sequential vs Parallel Demo", "sync")

    // Sequential execution
    addLog("📋 Sequential Execution (one after another):", "sync")
    const sequentialStart = performance.now()

    addLog("⏳ Starting API Call 1...", "async")
    await mockApiCall("API Call 1", 300)

    addLog("⏳ Starting API Call 2...", "async")
    await mockApiCall("API Call 2", 200)

    addLog("⏳ Starting API Call 3...", "async")
    await mockApiCall("API Call 3", 250)

    const sequentialTime = performance.now() - sequentialStart
    addLog(`⏱️ Sequential total time: ${sequentialTime.toFixed(0)}ms`, "sync")

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Parallel execution
    addLog("🚀 Parallel Execution (all at once):", "sync")
    const parallelStart = performance.now()

    addLog("⏳ Starting all API calls simultaneously...", "async")
    const promises = [
      mockApiCall("Parallel API 1", 300),
      mockApiCall("Parallel API 2", 200),
      mockApiCall("Parallel API 3", 250),
    ]

    await Promise.all(promises)

    const parallelTime = performance.now() - parallelStart
    addLog(`⚡ Parallel total time: ${parallelTime.toFixed(0)}ms`, "sync")
    addLog(
      `🎯 Performance improvement: ${(((sequentialTime - parallelTime) / sequentialTime) * 100).toFixed(1)}%`,
      "sync",
    )

    setIsRunning(false)
  }, [addLog, clearLogs])

  /**
   * EDUCATIONAL NOTE: Error Handling Patterns
   * This demonstrates proper async error handling techniques
   */
  const demonstrateErrorHandling = useCallback(async () => {
    setIsRunning(true)
    setCurrentDemo("error-handling")
    clearLogs()

    addLog("🛡️ Starting Error Handling Demo", "sync")

    // Mock function that randomly fails
    const unreliableApiCall = (name: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            addLog(`✅ ${name} succeeded`, "async")
            resolve(`${name} result`)
          } else {
            addLog(`❌ ${name} failed`, "error")
            reject(new Error(`${name} failed`))
          }
        }, 200)
      })
    }

    // Try-catch with async/await
    addLog("🔧 Pattern 1: Try-Catch with async/await", "sync")
    try {
      await unreliableApiCall("Reliable API")
    } catch (error) {
      addLog(`🚨 Caught error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    }

    // Promise.catch()
    addLog("🔧 Pattern 2: Promise.catch()", "sync")
    await unreliableApiCall("Another API")
      .then((result) => {
        addLog(`✅ Success: ${result}`, "async")
      })
      .catch((error) => {
        addLog(`🚨 Caught with .catch(): ${error.message}`, "error")
      })

    // Promise.allSettled for handling multiple promises
    addLog("🔧 Pattern 3: Promise.allSettled (handles all, regardless of failures)", "sync")
    const results = await Promise.allSettled([
      unreliableApiCall("API 1"),
      unreliableApiCall("API 2"),
      unreliableApiCall("API 3"),
    ])

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        addLog(`✅ API ${index + 1}: ${result.value}`, "async")
      } else {
        addLog(`❌ API ${index + 1}: ${result.reason.message}`, "error")
      }
    })

    setIsRunning(false)
  }, [addLog, clearLogs])

  /**
   * EDUCATIONAL NOTE: Real-world Student Management Async Patterns
   * This demonstrates practical async patterns in the context of our student management system
   */
  const demonstrateRealWorldPatterns = useCallback(async () => {
    setIsRunning(true)
    setCurrentDemo("real-world")
    clearLogs()

    addLog("🎓 Real-world Student Management Async Patterns", "sync")

    // Simulate student data operations
    const validateStudentEmail = (email: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isValid = email.includes("@") && email.includes(".")
          addLog(`📧 Email validation for ${email}: ${isValid ? "valid" : "invalid"}`, "async")
          resolve(isValid)
        }, 150)
      })
    }

    const checkEnrollmentCapacity = (course: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const hasCapacity = Math.random() > 0.3
          addLog(`🎯 Course ${course} capacity check: ${hasCapacity ? "available" : "full"}`, "async")
          resolve(hasCapacity)
        }, 200)
      })
    }

    const saveStudentToDatabase = (studentData: any): Promise<string> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            const studentId = `STU${Date.now()}`
            addLog(`💾 Student saved with ID: ${studentId}`, "async")
            resolve(studentId)
          } else {
            addLog(`❌ Database save failed`, "error")
            reject(new Error("Database connection failed"))
          }
        }, 300)
      })
    }

    // Pattern 1: Sequential validation (slower but simpler)
    addLog("🔄 Pattern 1: Sequential Validation", "sync")
    const studentData = {
      name: "John Doe",
      email: "john.doe@university.edu",
      course: "Computer Science",
    }

    try {
      addLog("⏳ Step 1: Validating email...", "async")
      const emailValid = await validateStudentEmail(studentData.email)

      if (!emailValid) {
        throw new Error("Invalid email format")
      }

      addLog("⏳ Step 2: Checking course capacity...", "async")
      const hasCapacity = await checkEnrollmentCapacity(studentData.course)

      if (!hasCapacity) {
        throw new Error("Course is full")
      }

      addLog("⏳ Step 3: Saving to database...", "async")
      const studentId = await saveStudentToDatabase(studentData)

      addLog(`🎉 Student enrollment successful! ID: ${studentId}`, "async")
    } catch (error) {
      addLog(`🚨 Enrollment failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Pattern 2: Parallel validation (faster)
    addLog("🚀 Pattern 2: Parallel Validation (where possible)", "sync")
    const anotherStudent = {
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      course: "Data Science",
    }

    try {
      addLog("⏳ Running email validation and capacity check in parallel...", "async")

      // Run validations in parallel
      const [emailValid2, hasCapacity2] = await Promise.all([
        validateStudentEmail(anotherStudent.email),
        checkEnrollmentCapacity(anotherStudent.course),
      ])

      if (!emailValid2) {
        throw new Error("Invalid email format")
      }

      if (!hasCapacity2) {
        throw new Error("Course is full")
      }

      addLog("⏳ Validations passed, saving to database...", "async")
      const studentId2 = await saveStudentToDatabase(anotherStudent)

      addLog(`🎉 Student enrollment successful! ID: ${studentId2}`, "async")
    } catch (error) {
      addLog(`🚨 Enrollment failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    }

    setIsRunning(false)
  }, [addLog, clearLogs])

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "sync":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "microtask":
        return <Clock className="h-4 w-4 text-green-500" />
      case "macrotask":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "async":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogBadgeVariant = (type: LogEntry["type"]) => {
    switch (type) {
      case "sync":
        return "default"
      case "microtask":
        return "secondary"
      case "macrotask":
        return "outline"
      case "async":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Async Patterns & Event Loop Demo</h2>
          <p className="text-muted-foreground">Interactive demonstrations of JavaScript async concepts</p>
        </div>
        <Button variant="outline" onClick={clearLogs} disabled={isRunning}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear Logs
        </Button>
      </div>

      <Tabs defaultValue="event-loop" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="event-loop">Event Loop</TabsTrigger>
          <TabsTrigger value="sequential-parallel">Sequential vs Parallel</TabsTrigger>
          <TabsTrigger value="error-handling">Error Handling</TabsTrigger>
          <TabsTrigger value="real-world">Real-world Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="event-loop" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript Event Loop</CardTitle>
              <CardDescription>
                Understand how JavaScript handles synchronous code, microtasks, and macrotasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Concept:</strong> JavaScript executes code in this order: 1) Synchronous code (Call
                  Stack), 2) Microtasks (Promises, queueMicrotask), 3) Macrotasks (setTimeout, setInterval)
                </AlertDescription>
              </Alert>
              <Button onClick={demonstrateEventLoop} disabled={isRunning}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Running..." : "Run Event Loop Demo"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequential-parallel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sequential vs Parallel Execution</CardTitle>
              <CardDescription>
                Compare performance between sequential (await one by one) and parallel (Promise.all) execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Tip:</strong> Use Promise.all() when operations don't depend on each other. Use
                  sequential await when operations depend on previous results.
                </AlertDescription>
              </Alert>
              <Button onClick={demonstrateSequentialVsParallel} disabled={isRunning}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Running..." : "Run Sequential vs Parallel Demo"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error-handling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Async Error Handling</CardTitle>
              <CardDescription>Learn different patterns for handling errors in async operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Best Practice:</strong> Always handle errors in async operations. Use try-catch with
                  async/await or .catch() with promises. Consider Promise.allSettled() for multiple operations.
                </AlertDescription>
              </Alert>
              <Button onClick={demonstrateErrorHandling} disabled={isRunning}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Running..." : "Run Error Handling Demo"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="real-world" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-world Student Management Patterns</CardTitle>
              <CardDescription>
                Practical async patterns in the context of student enrollment and data validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Real-world Application:</strong> This demo shows how to handle student enrollment with email
                  validation, capacity checking, and database operations using different async patterns.
                </AlertDescription>
              </Alert>
              <Button onClick={demonstrateRealWorldPatterns} disabled={isRunning}>
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Running..." : "Run Real-world Demo"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Execution Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Execution Log</span>
            {currentDemo && (
              <Badge variant="outline" className="ml-2">
                {currentDemo}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Watch the order of execution and understand how different async operations are handled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Run a demo above to see the execution log</p>
            ) : (
              logs.map((log, index) => (
                <div key={log.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                  <Badge variant="outline" className="text-xs min-w-[2rem]">
                    {index + 1}
                  </Badge>
                  {getLogIcon(log.type)}
                  <span className="flex-1 text-sm font-mono">{log.message}</span>
                  <Badge variant={getLogBadgeVariant(log.type)} className="text-xs">
                    {log.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{log.timestamp.toFixed(0)}ms</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Synchronous</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm">Microtask</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Macrotask</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Async Operation</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Error</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
