"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Edit, Trash2, Users, GraduationCap, UserCheck, UserX } from "lucide-react"
import type { Student } from "@/types/student"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

/**
 * EDUCATIONAL NOTE: Student List Component
 *
 * This component demonstrates several important React concepts:
 * 1. List Rendering: Efficiently rendering arrays of data
 * 2. Search and Filtering: Real-time data filtering with useMemo optimization
 * 3. Conditional Rendering: Showing different UI states based on data
 * 4. Event Handling: Managing user interactions (edit, delete)
 * 5. Performance Optimization: Using useMemo and useCallback to prevent unnecessary re-renders
 * 6. Responsive Design: Adapting layout for different screen sizes
 */

interface StudentListProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
}

export function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  /**
   * EDUCATIONAL NOTE: useMemo for Performance Optimization
   * This hook prevents expensive filtering operations from running on every render.
   * The filtered list is only recalculated when dependencies change.
   */
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search term filter (name or email)
      const matchesSearch =
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || student.status === statusFilter

      // Course filter
      const matchesCourse = courseFilter === "all" || student.course === courseFilter

      return matchesSearch && matchesStatus && matchesCourse
    })
  }, [students, searchTerm, statusFilter, courseFilter])

  /**
   * EDUCATIONAL NOTE: Derived State with useMemo
   * These statistics are computed from the filtered data and only update when necessary.
   */
  const statistics = useMemo(() => {
    const total = filteredStudents.length
    const active = filteredStudents.filter((s) => s.status === "active").length
    const inactive = filteredStudents.filter((s) => s.status === "inactive").length
    const graduated = filteredStudents.filter((s) => s.status === "graduated").length

    return { total, active, inactive, graduated }
  }, [filteredStudents])

  /**
   * EDUCATIONAL NOTE: Unique Values Extraction
   * This demonstrates how to extract unique values from an array of objects.
   */
  const availableCourses = useMemo(() => {
    const courses = [...new Set(students.map((student) => student.course))].sort()
    return courses
  }, [students])

  /**
   * EDUCATIONAL NOTE: useCallback for Event Handlers
   * These callbacks are memoized to prevent unnecessary re-renders of child components.
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  const handleCourseFilterChange = useCallback((value: string) => {
    setCourseFilter(value)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setCourseFilter("all")
  }, [])

  /**
   * EDUCATIONAL NOTE: Status Badge Component
   * This demonstrates conditional styling based on data values.
   */
  const getStatusBadge = useCallback((status: Student["status"]) => {
    const variants = {
      active: { variant: "default" as const, icon: UserCheck, className: "bg-primary text-primary-foreground" },
      inactive: { variant: "secondary" as const, icon: UserX, className: "bg-muted text-muted-foreground" },
      graduated: { variant: "outline" as const, icon: GraduationCap, className: "border-secondary text-secondary" },
    }

    const config = variants[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }, [])

  /**
   * EDUCATIONAL NOTE: Conditional Rendering - Empty State
   * This shows how to handle empty data states with meaningful UI.
   */
  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Students Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Get started by adding your first student to the system.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{statistics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-primary">{statistics.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-muted">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-muted/50 rounded-lg">
                <UserX className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-muted-foreground">{statistics.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Graduated</p>
                <p className="text-2xl font-bold text-secondary">{statistics.graduated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center justify-between">
            <span className="text-primary">Search & Filter</span>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-primary" : "hover:bg-primary/10 hover:text-primary"}
              >
                Table
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className={viewMode === "cards" ? "bg-primary" : "hover:bg-primary/10 hover:text-primary"}
              >
                Cards
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course Filter */}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={courseFilter} onValueChange={handleCourseFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {availableCourses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search terms or filters to find students.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <StudentTable students={filteredStudents} onEdit={onEdit} onDelete={onDelete} getStatusBadge={getStatusBadge} />
      ) : (
        <StudentCards students={filteredStudents} onEdit={onEdit} onDelete={onDelete} getStatusBadge={getStatusBadge} />
      )}
    </div>
  )
}

/**
 * EDUCATIONAL NOTE: Table View Component
 * This demonstrates responsive table design and data presentation.
 */
interface StudentTableProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  getStatusBadge: (status: Student["status"]) => JSX.Element
}

function StudentTable({ students, onEdit, onDelete, getStatusBadge }: StudentTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Students ({students.length})</CardTitle>
        <CardDescription>Manage your student records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.course}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Student</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {student.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(student.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * EDUCATIONAL NOTE: Card View Component
 * This demonstrates responsive card layouts and mobile-friendly design.
 */
interface StudentCardsProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  getStatusBadge: (status: Student["status"]) => JSX.Element
}

function StudentCards({ students, onEdit, onDelete, getStatusBadge }: StudentCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Students ({students.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {student.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(student.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Course</span>
                  <Badge variant="outline">{student.course}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(student.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Enrolled</span>
                  <span className="text-sm">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
