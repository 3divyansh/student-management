"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { StudentForm } from "@/components/student-form"
import { StudentList } from "@/components/student-list"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ResponsiveNavigation } from "@/components/responsive-navigation"
import { AsyncPatternsDemo } from "@/components/async-patterns-demo"
import { MentoringGuide } from "@/components/mentoring-guide"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student, Course } from "@/types/student"
import { mockApiService } from "@/lib/mock-api"
import { studentStorage } from "@/lib/student-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

/**
 * EDUCATIONAL NOTE: Student Management Dashboard - Complete Learning Project
 *
 * This application demonstrates several key React and JavaScript concepts:
 * 1. Async/Await: Used for API calls and data fetching
 * 2. Event Loop: Demonstrated with setTimeout and async operations
 * 3. State Management: Using useState, useEffect, useMemo for optimization
 * 4. Controlled Components: All form inputs are controlled by React state
 * 5. Error Handling: Proper loading and error states
 * 6. Performance Optimization: Custom hooks, memoization, and monitoring
 * 7. Responsive Design: Mobile-first approach with progressive enhancement
 * 8. Educational Content: Interactive demos and comprehensive mentoring guide
 */

export default function StudentDashboard() {
  // EDUCATIONAL NOTE: Performance monitoring for development
  const performanceMetrics = usePerformanceMonitor("StudentDashboard")

  // State management for students, courses, and UI states
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  // EDUCATIONAL NOTE: Persistent state with localStorage
  const [activeTab, setActiveTab] = useLocalStorage("student-dashboard-tab", "list")
  const [userPreferences, setUserPreferences] = useLocalStorage("user-preferences", {
    theme: "light",
    viewMode: "table",
    itemsPerPage: 10,
  })

  // EDUCATIONAL NOTE: Debounced search to prevent excessive filtering
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  /**
   * EDUCATIONAL NOTE: Event Loop Demonstration
   * This function demonstrates how the JavaScript event loop works with async operations.
   * The setTimeout creates a macrotask that will be executed after the current execution context.
   */
  const demonstrateEventLoop = useCallback(() => {
    console.log("1. Synchronous operation - executed immediately")

    setTimeout(() => {
      console.log("3. Macrotask (setTimeout) - executed after current stack is clear")
    }, 0)

    Promise.resolve().then(() => {
      console.log("2. Microtask (Promise) - executed before macrotasks")
    })

    console.log("1.5. Another synchronous operation - executed immediately")
  }, [])

  /**
   * EDUCATIONAL NOTE: Async/Await Pattern with Error Handling
   * This function demonstrates proper async/await usage with comprehensive error handling.
   */
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Demonstrate event loop concepts
      demonstrateEventLoop()

      // Simulate network delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Load courses from mock API
      const coursesData = await mockApiService.getCourses()
      setCourses(coursesData)

      // Load students from local storage
      const studentsData = studentStorage.getStudents()
      setStudents(studentsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [demonstrateEventLoop])

  // Load data on component mount
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  /**
   * EDUCATIONAL NOTE: useMemo Optimization
   * This demonstrates how useMemo prevents unnecessary recalculations.
   * The statistics will only be recalculated when the students array changes.
   */
  const studentStats = useMemo(() => {
    const totalStudents = students.length
    const courseDistribution = students.reduce(
      (acc, student) => {
        acc[student.course] = (acc[student.course] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: totalStudents,
      courseDistribution,
      mostPopularCourse: Object.entries(courseDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
    }
  }, [students])

  /**
   * EDUCATIONAL NOTE: Filtered Data with Debounced Search
   * This shows how to combine debouncing with useMemo for optimal performance.
   */
  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm) return students

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
  }, [students, debouncedSearchTerm])

  const handleAddStudent = useCallback(
    async (studentData: Omit<Student, "id">) => {
      try {
        const newStudent: Student = {
          ...studentData,
          id: Date.now().toString(), // Simple ID generation
        }

        const updatedStudents = [...students, newStudent]
        setStudents(updatedStudents)
        studentStorage.saveStudents(updatedStudents)
        setActiveTab("list")
      } catch (err) {
        setError("Failed to add student")
      }
    },
    [students, setActiveTab],
  )

  const handleEditStudent = useCallback(
    async (studentData: Omit<Student, "id">) => {
      if (!editingStudent) return

      try {
        const updatedStudent: Student = {
          ...studentData,
          id: editingStudent.id,
        }

        const updatedStudents = students.map((s) => (s.id === editingStudent.id ? updatedStudent : s))

        setStudents(updatedStudents)
        studentStorage.saveStudents(updatedStudents)
        setEditingStudent(null)
        setActiveTab("list")
      } catch (err) {
        setError("Failed to update student")
      }
    },
    [editingStudent, students, setActiveTab],
  )

  const handleDeleteStudent = useCallback(
    (studentId: string) => {
      const updatedStudents = students.filter((s) => s.id !== studentId)
      setStudents(updatedStudents)
      studentStorage.saveStudents(updatedStudents)
    },
    [students],
  )

  const startEditing = useCallback(
    (student: Student) => {
      setEditingStudent(student)
      setActiveTab("form")
    },
    [setActiveTab],
  )

  const cancelEditing = useCallback(() => {
    setEditingStudent(null)
    setActiveTab("list")
  }, [setActiveTab])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ErrorMessage message={error} onRetry={loadInitialData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 text-balance">
                Student Management Dashboard
              </h1>
              <p className="text-muted-foreground text-base md:text-xl text-pretty">
                Manage student records with modern React patterns and best practices
              </p>
            </div>

            {/* Responsive Navigation */}
            <ResponsiveNavigation activeTab={activeTab} onTabChange={setActiveTab} studentCount={students.length} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{studentStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Active learners</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{courses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Learning paths</p>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-2 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Popular Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-primary truncate">{studentStats.mostPopularCourse}</div>
              <p className="text-xs text-muted-foreground mt-1">Top choice among students</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
            <CardTitle className="text-xl text-primary">Student Management</CardTitle>
            <CardDescription className="text-base">
              Add new students or manage existing records with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Content based on active tab */}
            {activeTab === "list" && (
              <StudentList students={filteredStudents} onEdit={startEditing} onDelete={handleDeleteStudent} />
            )}

            {activeTab === "form" && (
              <StudentForm
                courses={courses}
                onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
                initialData={editingStudent}
                onCancel={editingStudent ? cancelEditing : undefined}
              />
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8">
                <Tabs defaultValue="demos" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="demos">Interactive Demos</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="guide">Mentoring Guide</TabsTrigger>
                  </TabsList>

                  <TabsContent value="demos" className="mt-6">
                    <AsyncPatternsDemo />
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Course Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(studentStats.courseDistribution).map(([course, count]) => (
                              <div key={course} className="flex items-center justify-between">
                                <span className="text-sm">{course}</span>
                                <Badge variant="secondary">{count}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Render Count:</span>
                              <span>{performanceMetrics.renderCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Render:</span>
                              <span>{performanceMetrics.lastRenderTime.toFixed(2)}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Render:</span>
                              <span>{performanceMetrics.averageRenderTime.toFixed(2)}ms</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="guide" className="mt-6">
                    <MentoringGuide />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Settings</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Preferences</CardTitle>
                    <CardDescription>Customize your dashboard experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Theme</label>
                        <p className="text-sm text-muted-foreground">Current: {userPreferences.theme}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">View Mode</label>
                        <p className="text-sm text-muted-foreground">Current: {userPreferences.viewMode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Items Per Page</label>
                        <p className="text-sm text-muted-foreground">Current: {userPreferences.itemsPerPage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Monitor - Development Tool */}
      {process.env.NODE_ENV === "development" && <PerformanceMonitor />}
    </div>
  )
}
