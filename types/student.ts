/**
 * EDUCATIONAL NOTE: TypeScript Interfaces
 * These interfaces define the shape of our data structures.
 * TypeScript helps catch errors at compile time and provides better IDE support.
 */

export interface Student {
  id: string
  name: string
  email: string
  course: string
  profileImage?: string
  enrollmentDate: string
  status: "active" | "inactive" | "graduated"
}

export interface Course {
  id: string
  name: string
  code: string
  description: string
  duration: string
  instructor: string
}

export interface FormErrors {
  name?: string
  email?: string
  course?: string
}
