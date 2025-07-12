import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideInPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  position?: "left" | "right"
  size?: "sm" | "md" | "lg"
}

const SlideInPanel = React.forwardRef<HTMLDivElement, SlideInPanelProps>(
  ({ 
    className, 
    isOpen, 
    onClose, 
    title, 
    position = "right",
    size = "md",
    children, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: "w-80",
      md: "w-96",
      lg: "w-[32rem]"
    }

    const slideClasses = {
      left: {
        container: "left-0",
        transform: isOpen ? "translate-x-0" : "-translate-x-full"
      },
      right: {
        container: "right-0",
        transform: isOpen ? "translate-x-0" : "translate-x-full"
      }
    }

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div
          ref={ref}
          className={cn(
            "fixed top-0 h-full bg-background border-l shadow-lg z-50 transition-transform duration-300 ease-in-out",
            slideClasses[position].container,
            slideClasses[position].transform,
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </>
    )
  }
)
SlideInPanel.displayName = "SlideInPanel"

export { SlideInPanel }