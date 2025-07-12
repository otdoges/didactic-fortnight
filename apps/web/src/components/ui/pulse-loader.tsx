import * as React from "react"
import { cn } from "@/lib/utils"

interface PulseLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: string
  count?: number
}

const PulseLoader = React.forwardRef<HTMLDivElement, PulseLoaderProps>(
  ({ className, size = "md", color = "currentColor", count = 3, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3", 
      lg: "w-4 h-4"
    }

    const gapClasses = {
      sm: "gap-1",
      md: "gap-1.5",
      lg: "gap-2"
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", gapClasses[size], className)}
        {...props}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full animate-pulse",
              sizeClasses[size]
            )}
            style={{ 
              backgroundColor: color,
              animationDelay: `${i * 200}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    )
  }
)
PulseLoader.displayName = "PulseLoader"

export { PulseLoader }