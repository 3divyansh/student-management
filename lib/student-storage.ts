import type { Student } from "@/types/student"

/**
 * EDUCATIONAL NOTE: Local Storage Management
 * This utility handles browser storage operations with proper error handling.
 * In a real application, this would be replaced with API calls to a backend.
 */

const STORAGE_KEY = "student-management-data"

class StudentStorage {
  /**
   * Retrieves students from localStorage with error handling
   */
  getStudents(): Student[] {
    try {
      if (typeof window === "undefined") {
        // Server-side rendering compatibility
        return []
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return this.getDefaultStudents()
      }

      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : this.getDefaultStudents()
    } catch (error) {
      console.error("Error loading students from storage:", error)
      return this.getDefaultStudents()
    }
  }

  /**
   * Saves students to localStorage with error handling
   */
  saveStudents(students: Student[]): boolean {
    try {
      if (typeof window === "undefined") {
        return false
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
      return true
    } catch (error) {
      console.error("Error saving students to storage:", error)
      return false
    }
  }

  /**
   * Clears all student data
   */
  clearStudents(): boolean {
    try {
      if (typeof window === "undefined") {
        return false
      }

      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error("Error clearing students from storage:", error)
      return false
    }
  }

  /**
   * Returns default sample students for demonstration
   */
  private getDefaultStudents(): Student[] {
    return [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        course: "Computer Science",
        profileImage: "/professional-woman-portrait.png",
        enrollmentDate: "2024-01-15",
        status: "active",
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@email.com",
        course: "Data Science",
        profileImage: "/professional-man-portrait.png",
        enrollmentDate: "2024-02-01",
        status: "active",
      },
      {
        id: "3",
        name: "Carol Davis",
        email: "carol.davis@email.com",
        course: "Web Development",
        profileImage: "/professional-woman-portrait.png",
        enrollmentDate: "2023-09-10",
        status: "graduated",
      },
    ]
  }
}

// Export singleton instance
export const studentStorage = new StudentStorage()
