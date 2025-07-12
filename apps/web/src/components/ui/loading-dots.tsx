import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4"
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full bg-current animate-pulse",
            sizeClasses[size]
          )}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn(
            "rounded-full bg-current animate-pulse",
            sizeClasses[size]
          )}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={cn(
            "rounded-full bg-current animate-pulse",
            sizeClasses[size]
          )}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

export { LoadingDots }