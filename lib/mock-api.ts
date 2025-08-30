import type { Course } from "@/types/student"

/**
 * EDUCATIONAL NOTE: Mock API Service
 * This demonstrates async/await patterns and simulates real API behavior.
 * In a real application, these would be actual HTTP requests to a backend.
 */

// Mock courses data
const mockCourses: Course[] = [
  {
    id: "1",
    name: "Computer Science",
    code: "CS101",
    description: "Introduction to programming and computer science fundamentals",
    duration: "4 years",
    instructor: "Dr. Sarah Johnson",
  },
  {
    id: "2",
    name: "Data Science",
    code: "DS201",
    description: "Data analysis, machine learning, and statistical modeling",
    duration: "2 years",
    instructor: "Prof. Michael Chen",
  },
  {
    id: "3",
    name: "Web Development",
    code: "WD301",
    description: "Full-stack web development with modern frameworks",
    duration: "1 year",
    instructor: "Ms. Emily Rodriguez",
  },
  {
    id: "4",
    name: "Mobile Development",
    code: "MD401",
    description: "iOS and Android app development",
    duration: "18 months",
    instructor: "Mr. David Kim",
  },
  {
    id: "5",
    name: "Cybersecurity",
    code: "CY501",
    description: "Information security and ethical hacking",
    duration: "3 years",
    instructor: "Dr. Lisa Thompson",
  },
]

/**
 * EDUCATIONAL NOTE: Async/Await Implementation
 * This class demonstrates how to structure async operations.
 * The artificial delays simulate network latency you'd encounter with real APIs.
 */
class MockApiService {
  /**
   * Simulates fetching courses from an external API
   * Demonstrates async/await with error handling and network simulation
   */
  async getCourses(): Promise<Course[]> {
    // Simulate network delay
    await this.simulateNetworkDelay(500, 1500)

    // Simulate occasional API failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to fetch courses from API")
    }

    // Return a copy to prevent external mutations
    return JSON.parse(JSON.stringify(mockCourses))
  }

  /**
   * Simulates getting a specific course by ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    await this.simulateNetworkDelay(200, 800)

    const course = mockCourses.find((c) => c.id === id)
    return course ? JSON.parse(JSON.stringify(course)) : null
  }

  /**
   * Simulates network delay with random variation
   * This helps demonstrate loading states and async behavior
   */
  private async simulateNetworkDelay(min = 300, max = 1000): Promise<void> {
    const delay = Math.random() * (max - min) + min

    return new Promise((resolve) => {
      // EDUCATIONAL NOTE: setTimeout and Event Loop
      // This setTimeout creates a macrotask that will be executed
      // after the current execution context is complete
      setTimeout(resolve, delay)
    })
  }

  /**
   * EDUCATIONAL NOTE: Promise-based API simulation
   * This method shows how to work with Promise.resolve() for immediate resolution
   * vs setTimeout for delayed resolution
   */
  async validateEmail(email: string): Promise<boolean> {
    // Immediate validation (microtask)
    if (!email.includes("@")) {
      return Promise.resolve(false)
    }

    // Simulate server-side validation with delay (macrotask)
    await this.simulateNetworkDelay(100, 300)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const mockApiService = new MockApiService()
