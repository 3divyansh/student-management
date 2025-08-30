"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * EDUCATIONAL NOTE: Error Handling Component
 * This shows how to create reusable error UI with retry functionality.
 */

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription>Something went wrong</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full bg-transparent">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
