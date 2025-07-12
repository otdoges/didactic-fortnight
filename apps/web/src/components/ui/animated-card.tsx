import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  hover?: boolean
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    title, 
    description, 
    children, 
    delay = 0, 
    direction = "up",
    hover = true,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const cardRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          }
        },
        { threshold: 0.1 }
      )

      if (cardRef.current) {
        observer.observe(cardRef.current)
      }

      return () => observer.disconnect()
    }, [delay])

    const getDirectionClasses = () => {
      if (!isVisible) {
        switch (direction) {
          case "up":
            return "translate-y-8 opacity-0"
          case "down":
            return "-translate-y-8 opacity-0"
          case "left":
            return "translate-x-8 opacity-0"
          case "right":
            return "-translate-x-8 opacity-0"
          default:
            return "translate-y-8 opacity-0"
        }
      }
      return "translate-y-0 translate-x-0 opacity-100"
    }

    return (
      <Card
        ref={cardRef}
        className={cn(
          "transition-all duration-700 ease-out",
          getDirectionClasses(),
          hover && "hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }