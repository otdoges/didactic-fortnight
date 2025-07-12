import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  showText?: boolean
}

const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ 
    className, 
    progress, 
    size = 40, 
    strokeWidth = 4, 
    color = "currentColor",
    showText = false,
    ...props 
  }, ref) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showText && (
          <div className="absolute text-xs font-medium">
            {Math.round(progress)}%
          </div>
        )}
      </div>
    )
  }
)
ProgressRing.displayName = "ProgressRing"

export { ProgressRing }