// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, Upload, X } from "lucide-react"
// import type { Student, Course, FormErrors } from "@/types/student"
// import { mockApiService } from "@/lib/mock-api"

// /**
//  * EDUCATIONAL NOTE: Controlled Components and Form Validation
//  *
//  * This component demonstrates several key React concepts:
//  * 1. Controlled Components: All form inputs are controlled by React state
//  * 2. Form Validation: Client-side validation with real-time feedback
//  * 3. Async Validation: Email validation using async/await
//  * 4. Error Handling: Comprehensive error states and user feedback
//  * 5. State Management: Proper use of useState and useEffect
//  * 6. Performance Optimization: useMemo and useCallback for preventing re-renders
//  */

// interface StudentFormProps {
//   courses: Course[]
//   onSubmit: (student: Omit<Student, "id">) => Promise<void>
//   initialData?: Student | null
//   onCancel?: () => void
// }

// export function StudentForm({ courses, onSubmit, initialData, onCancel }: StudentFormProps) {
//   // EDUCATIONAL NOTE: Controlled Component State
//   // All form inputs are controlled by React state, ensuring single source of truth
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     course: "",
//     profileImage: "",
//     status: "active" as const,
//   })

//   const [errors, setErrors] = useState<FormErrors>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isValidatingEmail, setIsValidatingEmail] = useState(false)
//   const [emailValidationResult, setEmailValidationResult] = useState<boolean | null>(null)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)

//   // Initialize form with existing data when editing
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name,
//         email: initialData.email,
//         course: initialData.course,
//         profileImage: initialData.profileImage || "",
//         status: initialData.status,
//       })
//       setImagePreview(initialData.profileImage || null)
//     }
//   }, [initialData])

//   /**
//    * EDUCATIONAL NOTE: Input Validation Functions
//    * These functions demonstrate different validation patterns:
//    * - Synchronous validation (name, required fields)
//    * - Pattern matching (email format)
//    * - Async validation (email uniqueness check)
//    */

//   const validateName = useCallback((name: string): string | undefined => {
//     if (!name.trim()) {
//       return "Name is required"
//     }
//     if (name.trim().length < 2) {
//       return "Name must be at least 2 characters long"
//     }
//     if (name.trim().length > 50) {
//       return "Name must be less than 50 characters"
//     }
//     // Check for valid name pattern (letters, spaces, hyphens, apostrophes)
//     if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
//       return "Name can only contain letters, spaces, hyphens, and apostrophes"
//     }
//     return undefined
//   }, [])

//   const validateEmailFormat = useCallback((email: string): string | undefined => {
//     if (!email.trim()) {
//       return "Email is required"
//     }

//     // Basic email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       return "Please enter a valid email address"
//     }

//     return undefined
//   }, [])

//   const validateCourse = useCallback((course: string): string | undefined => {
//     if (!course) {
//       return "Please select a course"
//     }
//     return undefined
//   }, [])

//   /**
//    * EDUCATIONAL NOTE: Async Email Validation
//    * This demonstrates async/await patterns with debouncing to avoid excessive API calls.
//    * The validation runs after the user stops typing for 500ms.
//    */
//   const validateEmailAsync = useCallback(
//     async (email: string): Promise<void> => {
//       // Skip async validation if format is invalid
//       if (validateEmailFormat(email)) {
//         setEmailValidationResult(null)
//         return
//       }

//       try {
//         setIsValidatingEmail(true)
//         setEmailValidationResult(null)

//         // Simulate server-side email validation
//         const isValid = await mockApiService.validateEmail(email)
//         setEmailValidationResult(isValid)
//       } catch (error) {
//         console.error("Email validation failed:", error)
//         setEmailValidationResult(null)
//       } finally {
//         setIsValidatingEmail(false)
//       }
//     },
//     [validateEmailFormat],
//   )

//   // Debounced email validation effect
//   useEffect(() => {
//     if (!formData.email) {
//       setEmailValidationResult(null)
//       return
//     }

//     const timeoutId = setTimeout(() => {
//       validateEmailAsync(formData.email)
//     }, 500) // 500ms debounce

//     return () => clearTimeout(timeoutId)
//   }, [formData.email, validateEmailAsync])

//   /**
//    * EDUCATIONAL NOTE: Real-time Validation
//    * This function runs validation as the user types, providing immediate feedback.
//    * It demonstrates how to validate individual fields and update error state.
//    */
//   const validateField = useCallback(
//     (fieldName: keyof typeof formData, value: string) => {
//       let fieldError: string | undefined

//       switch (fieldName) {
//         case "name":
//           fieldError = validateName(value)
//           break
//         case "email":
//           fieldError = validateEmailFormat(value)
//           break
//         case "course":
//           fieldError = validateCourse(value)
//           break
//       }

//       setErrors((prev) => ({
//         ...prev,
//         [fieldName]: fieldError,
//       }))

//       return !fieldError
//     },
//     [validateName, validateEmailFormat, validateCourse],
//   )

//   /**
//    * EDUCATIONAL NOTE: Form Input Handlers
//    * These handlers demonstrate the controlled component pattern.
//    * Each input's value is controlled by React state, and changes flow through these handlers.
//    */
//   const handleInputChange = useCallback(
//     (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value

//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }))

//       // Real-time validation
//       validateField(field, value)
//     },
//     [validateField],
//   )

//   const handleSelectChange = useCallback(
//     (field: keyof typeof formData) => (value: string) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }))

//       // Validate select fields
//       validateField(field, value)
//     },
//     [validateField],
//   )

//   /**
//    * EDUCATIONAL NOTE: File Upload Handling
//    * This demonstrates how to handle file uploads with preview functionality.
//    * In a real application, you'd upload to a server or cloud storage.
//    */
//   const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setErrors((prev) => ({
//         ...prev,
//         profileImage: "Please select a valid image file",
//       }))
//       return
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setErrors((prev) => ({
//         ...prev,
//         profileImage: "Image size must be less than 5MB",
//       }))
//       return
//     }

//     // Create preview URL
//     const reader = new FileReader()
//     reader.onload = (event) => {
//       const imageUrl = event.target?.result as string
//       setImagePreview(imageUrl)
//       setFormData((prev) => ({
//         ...prev,
//         profileImage: imageUrl,
//       }))
//       setErrors((prev) => ({
//         ...prev,
//         profileImage: undefined,
//       }))
//     }
//     reader.readAsDataURL(file)
//   }, [])

//   const removeImage = useCallback(() => {
//     setImagePreview(null)
//     setFormData((prev) => ({
//       ...prev,
//       profileImage: "",
//     }))
//   }, [])

//   /**
//    * EDUCATIONAL NOTE: Form Validation
//    * This function performs comprehensive form validation before submission.
//    * It demonstrates how to validate all fields and collect errors.
//    */
//   const validateForm = useCallback((): boolean => {
//     const newErrors: FormErrors = {}

//     // Validate all fields
//     const nameError = validateName(formData.name)
//     const emailError = validateEmailFormat(formData.email)
//     const courseError = validateCourse(formData.course)

//     if (nameError) newErrors.name = nameError
//     if (emailError) newErrors.email = emailError
//     if (courseError) newErrors.course = courseError

//     // Check async email validation result
//     if (emailValidationResult === false) {
//       newErrors.email = "This email address is already in use"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData, validateName, validateEmailFormat, validateCourse, emailValidationResult])

//   /**
//    * EDUCATIONAL NOTE: Form Submission Handler
//    * This demonstrates async form submission with proper error handling and loading states.
//    */
//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault()

//       // Validate form before submission
//       if (!validateForm()) {
//         return
//       }

//       try {
//         setIsSubmitting(true)

//         // Prepare student data
//         const studentData: Omit<Student, "id"> = {
//           name: formData.name.trim(),
//           email: formData.email.trim().toLowerCase(),
//           course: formData.course,
//           profileImage: formData.profileImage || undefined,
//           enrollmentDate: initialData?.enrollmentDate || new Date().toISOString().split("T")[0],
//           status: formData.status,
//         }

//         // Submit the form
//         await onSubmit(studentData)

//         // Reset form if adding new student
//         if (!initialData) {
//           setFormData({
//             name: "",
//             email: "",
//             course: "",
//             profileImage: "",
//             status: "active",
//           })
//           setImagePreview(null)
//           setErrors({})
//           setEmailValidationResult(null)
//         }
//       } catch (error) {
//         console.error("Form submission failed:", error)
//         setErrors({
//           email: "Failed to save student. Please try again.",
//         })
//       } finally {
//         setIsSubmitting(false)
//       }
//     },
//     [formData, validateForm, onSubmit, initialData],
//   )

//   /**
//    * EDUCATIONAL NOTE: useMemo Optimization
//    * This prevents unnecessary recalculation of form validity on every render.
//    * The form is only considered valid when all validations pass.
//    */
//   const isFormValid = useMemo(() => {
//     return (
//       formData.name.trim() &&
//       formData.email.trim() &&
//       formData.course &&
//       Object.keys(errors).length === 0 &&
//       emailValidationResult !== false &&
//       !isValidatingEmail
//     )
//   }, [formData, errors, emailValidationResult, isValidatingEmail])

//   const selectedCourse = useMemo(() => {
//     return courses.find((course) => course.name === formData.course)
//   }, [courses, formData.course])

//   return (
//     <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10">
//       <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
//         <CardTitle className="text-xl text-primary">{initialData ? "Edit Student" : "Add New Student"}</CardTitle>
//         <CardDescription className="text-base">
//           {initialData ? "Update student information" : "Enter student details to add them to the system"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Profile Image Upload */}
//           <div className="space-y-2">
//             <Label>Profile Image (Optional)</Label>
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
//                 <AvatarFallback className="text-lg">
//                   {formData.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .toUpperCase() || "?"}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex space-x-2">
//                   <Button type="button" variant="outline" size="sm" asChild>
//                     <label className="cursor-pointer">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload Image
//                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                     </label>
//                   </Button>
//                   {imagePreview && (
//                     <Button type="button" variant="outline" size="sm" onClick={removeImage}>
//                       <X className="h-4 w-4 mr-2" />
//                       Remove
//                     </Button>
//                   )}
//                 </div>
//                 {errors.profileImage && <p className="text-sm text-destructive mt-1">{errors.profileImage}</p>}
//               </div>
//             </div>
//           </div>

//           {/* Name Field */}
//           <div className="space-y-2">
//             <Label htmlFor="name">
//               Full Name <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="name"
//               type="text"
//               placeholder="Enter student's full name"
//               value={formData.name}
//               onChange={handleInputChange("name")}
//               className={errors.name ? "border-destructive" : ""}
//             />
//             {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
//           </div>

//           {/* Email Field with Async Validation */}
//           <div className="space-y-2">
//             <Label htmlFor="email">
//               Email Address <span className="text-destructive">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter email address"
//                 value={formData.email}
//                 onChange={handleInputChange("email")}
//                 className={`${errors.email ? "border-destructive" : ""} ${
//                   emailValidationResult === true ? "border-primary" : ""
//                 }`}
//               />
//               {isValidatingEmail && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <Loader2 className="h-4 w-4 animate-spin text-primary" />
//                 </div>
//               )}
//             </div>
//             {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
//             {emailValidationResult === true && !errors.email && (
//               <p className="text-sm text-primary font-medium">✓ Email is available</p>
//             )}
//           </div>

//           {/* Course Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="course">
//               Course <span className="text-destructive">*</span>
//             </Label>
//             <Select value={formData.course} onValueChange={handleSelectChange("course")}>
//               <SelectTrigger className={errors.course ? "border-destructive" : ""}>
//                 <SelectValue placeholder="Select a course" />
//               </SelectTrigger>
//               <SelectContent>
//                 {courses.map((course) => (
//                   <SelectItem key={course.id} value={course.name}>
//                     <div className="flex flex-col">
//                       <span className="font-medium">{course.name}</span>
//                       <span className="text-sm text-muted-foreground">{course.code}</span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.course && <p className="text-sm text-destructive">{errors.course}</p>}
//           </div>

//           {/* Course Information Display */}
//           {selectedCourse && (
//             <Alert className="border-primary/20 bg-primary/5">
//               <AlertDescription>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="font-semibold text-primary">{selectedCourse.name}</span>
//                     <Badge variant="secondary" className="bg-secondary/20 text-secondary">
//                       {selectedCourse.duration}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
//                   <p className="text-sm">
//                     <span className="font-medium text-primary">Instructor:</span> {selectedCourse.instructor}
//                   </p>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Status Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="status">Status</Label>
//             <Select value={formData.status} onValueChange={handleSelectChange("status")}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="graduated">Graduated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Form Actions */}
//           <div className="flex space-x-4 pt-6">
//             <Button
//               type="submit"
//               disabled={!isFormValid || isSubmitting}
//               className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   {initialData ? "Updating..." : "Adding..."}
//                 </>
//               ) : (
//                 <>{initialData ? "Update Student" : "Add Student"}</>
//               )}
//             </Button>
//             {onCancel && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onCancel}
//                 disabled={isSubmitting}
//                 className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-transparent"
//               >
//                 Cancel
//               </Button>
//             )}
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }














"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X } from "lucide-react"
import type { Student, Course, FormErrors } from "@/types/student"
import { mockApiService } from "@/lib/mock-api"

/**
 * EDUCATIONAL NOTE: Controlled Components and Form Validation
 *
 * This component demonstrates several key React concepts:
 * 1. Controlled Components: All form inputs are controlled by React state
 * 2. Form Validation: Client-side validation with real-time feedback
 * 3. Async Validation: Email validation using async/await
 * 4. Error Handling: Comprehensive error states and user feedback
 * 5. State Management: Proper use of useState and useEffect
 * 6. Performance Optimization: useMemo and useCallback for preventing re-renders
 */

interface StudentFormProps {
  courses: Course[]
  onSubmit: (student: Omit<Student, "id"> & Partial<Pick<Student, "id">>) => Promise<void>
  initialData?: Student | null
  onCancel?: () => void
}

export function StudentForm({ courses, onSubmit, initialData, onCancel }: StudentFormProps) {
  // EDUCATIONAL NOTE: Controlled Component State
  // All form inputs are controlled by React state, ensuring single source of truth
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    profileImage: "",
    status: "active" as const,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)
  const [emailValidationResult, setEmailValidationResult] = useState<boolean | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        course: initialData.course,
        profileImage: initialData.profileImage || "",
        status: initialData.status,
      })
      setImagePreview(initialData.profileImage || null)
    }
  }, [initialData])

  /**
   * EDUCATIONAL NOTE: Input Validation Functions
   * These functions demonstrate different validation patterns:
   * - Synchronous validation (name, required fields)
   * - Pattern matching (email format)
   * - Async validation (email uniqueness check)
   */

  const validateName = useCallback((name: string): string | undefined => {
    if (!name.trim()) {
      return "Name is required"
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters"
    }
    // Check for valid name pattern (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes"
    }
    return undefined
  }, [])

  const validateEmailFormat = useCallback((email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required"
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }

    return undefined
  }, [])

  const validateCourse = useCallback((course: string): string | undefined => {
    if (!course) {
      return "Please select a course"
    }
    return undefined
  }, [])

  /**
   * EDUCATIONAL NOTE: Async Email Validation
   * This demonstrates async/await patterns with debouncing to avoid excessive API calls.
   * The validation runs after the user stops typing for 500ms.
   */
  const validateEmailAsync = useCallback(
    async (email: string): Promise<void> => {
      // Skip async validation if format is invalid
      if (validateEmailFormat(email)) {
        setEmailValidationResult(null)
        return
      }

      // When editing, allow unchanged email (skip uniqueness check)
      if (initialData?.email && email.trim().toLowerCase() === initialData.email.trim().toLowerCase()) {
        setEmailValidationResult(true)
        return
      }

      try {
        setIsValidatingEmail(true)
        setEmailValidationResult(null)

        // Simulate server-side email validation
        const isValid = await mockApiService.validateEmail(email)
        setEmailValidationResult(isValid)
      } catch (error) {
        console.error("Email validation failed:", error)
        setEmailValidationResult(null)
      } finally {
        setIsValidatingEmail(false)
      }
    },
    [validateEmailFormat, initialData],
  )

  // Debounced email validation effect
  useEffect(() => {
    if (!formData.email) {
      setEmailValidationResult(null)
      return
    }

    const timeoutId = setTimeout(() => {
      validateEmailAsync(formData.email)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [formData.email, validateEmailAsync])

  /**
   * EDUCATIONAL NOTE: Real-time Validation
   * This function runs validation as the user types, providing immediate feedback.
   * It demonstrates how to validate individual fields and update error state.
   */
  const validateField = useCallback(
    (fieldName: keyof typeof formData, value: string) => {
      let fieldError: string | undefined

      switch (fieldName) {
        case "name":
          fieldError = validateName(value)
          break
        case "email":
          fieldError = validateEmailFormat(value)
          break
        case "course":
          fieldError = validateCourse(value)
          break
      }

      setErrors((prev) => {
        const next = { ...prev }
        if (fieldError) {
          next[fieldName] = fieldError
        } else {
          delete next[fieldName]
        }
        return next
      })

      return !fieldError
    },
    [validateName, validateEmailFormat, validateCourse],
  )

  /**
   * EDUCATIONAL NOTE: Form Input Handlers
   * These handlers demonstrate the controlled component pattern.
   * Each input's value is controlled by React state, and changes flow through these handlers.
   */
  const handleInputChange = useCallback(
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Real-time validation
      validateField(field, value)
    },
    [validateField],
  )

  const handleSelectChange = useCallback(
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Validate select fields
      validateField(field, value)
    },
    [validateField],
  )

  /**
   * EDUCATIONAL NOTE: File Upload Handling
   * This demonstrates how to handle file uploads with preview functionality.
   * In a real application, you'd upload to a server or cloud storage.
   */
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => {
        const next = { ...prev }
        next.profileImage = "Please select a valid image file"
        return next
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => {
        const next = { ...prev }
        next.profileImage = "Image size must be less than 5MB"
        return next
      })
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setImagePreview(imageUrl)
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }))
      // Remove profileImage error when valid
      setErrors((prev) => {
        const next = { ...prev }
        delete next.profileImage
        return next
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const removeImage = useCallback(() => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }))
    // Clear any image error when removing
    setErrors((prev) => {
      const next = { ...prev }
      delete next.profileImage
      return next
    })
  }, [])

  /**
   * EDUCATIONAL NOTE: Form Validation
   * This function performs comprehensive form validation before submission.
   * It demonstrates how to validate all fields and collect errors.
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Validate all fields
    const nameError = validateName(formData.name)
    const emailError = validateEmailFormat(formData.email)
    const courseError = validateCourse(formData.course)

    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (courseError) newErrors.course = courseError

    // Check async email validation result
    if (emailValidationResult === false) {
      newErrors.email = "This email address is already in use"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validateName, validateEmailFormat, validateCourse, emailValidationResult])

  /**
   * EDUCATIONAL NOTE: Form Submission Handler
   * This demonstrates async form submission with proper error handling and loading states.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form before submission
      if (!validateForm()) {
        return
      }

      try {
        setIsSubmitting(true)

        const studentData: Omit<Student, "id"> & Partial<Pick<Student, "id">> = {
          ...(initialData?.id ? { id: initialData.id } : {}),
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          course: formData.course,
          profileImage: formData.profileImage || undefined,
          // Keep existing enrollmentDate if editing, otherwise set today's date
          enrollmentDate: initialData?.enrollmentDate ?? new Date().toISOString().split("T")[0],
          status: formData.status,
        }

        await onSubmit(studentData)

        if (!initialData) {
          setFormData({
            name: "",
            email: "",
            course: "",
            profileImage: "",
            status: "active",
          })
          setImagePreview(null)
          setErrors({})
          setEmailValidationResult(null)
        }
      } catch (error) {
        console.error("Form submission failed:", error)
        setErrors({
          email: "Failed to save student. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, onSubmit, initialData],
  )

  /**
   * EDUCATIONAL NOTE: useMemo Optimization
   * This prevents unnecessary recalculation of form validity on every render.
   * The form is only considered valid when all validations pass.
   */
  const isFormValid = useMemo(() => {
    // Consider only truthy errors; ignore keys with undefined
    const hasErrors = Object.values(errors).some(Boolean)
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.course &&
      !hasErrors &&
      emailValidationResult !== false &&
      !isValidatingEmail
    )
  }, [formData, errors, emailValidationResult, isValidatingEmail])

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course.name === formData.course)
  }, [courses, formData.course])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
        <CardTitle className="text-xl text-primary">{initialData ? "Edit Student" : "Add New Student"}</CardTitle>
        <CardDescription className="text-base">
          {initialData ? "Update student information" : "Enter student details to add them to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image (Optional)</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
                <AvatarFallback className="text-lg">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </Button>
                  {imagePreview && (
                    <Button type="button" variant="outline" size="sm" onClick={removeImage}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                {errors.profileImage && <p className="text-sm text-destructive mt-1">{errors.profileImage}</p>}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter student's full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Email Field with Async Validation */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={`${errors.email ? "border-destructive" : ""} ${
                  emailValidationResult === true ? "border-primary" : ""
                }`}
              />
              {isValidatingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            {emailValidationResult === true && !errors.email && (
              <p className="text-sm text-primary font-medium">✓ Email is available</p>
            )}
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course">
              Course <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.course} onValueChange={handleSelectChange("course")}>
              <SelectTrigger className={errors.course ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.name}>
                    <div className="flex flex-col">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-sm text-muted-foreground">{course.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.course && <p className="text-sm text-destructive">{errors.course}</p>}
          </div>

          {/* Course Information Display */}
          {selectedCourse && (
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{selectedCourse.name}</span>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                      {selectedCourse.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  <p className="text-sm">
                    <span className="font-medium text-primary">Instructor:</span> {selectedCourse.instructor}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleSelectChange("status")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Student</>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-transparent"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
