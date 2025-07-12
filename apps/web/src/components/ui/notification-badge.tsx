import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const notificationBadgeVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-center justify-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        info: "bg-blue-500 text-white",
        dark: "bg-gray-900 text-white",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface NotificationBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationBadgeVariants> {
  show?: boolean
}

const NotificationBadge = React.forwardRef<
  HTMLDivElement,
  NotificationBadgeProps
>(({ className, variant, size, show = true, children, ...props }, ref) => {
  if (!show) return null

  return (
    <div
      ref={ref}
      className={cn(
        notificationBadgeVariants({ variant, size }),
        "animate-in slide-in-from-bottom-2 fade-in-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
NotificationBadge.displayName = "NotificationBadge"

export { NotificationBadge, notificationBadgeVariants }