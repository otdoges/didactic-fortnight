"use client"

import { motion } from "framer-motion"
import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedInputProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  className?: string
  required?: boolean
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    label, 
    placeholder, 
    type = "text", 
    value, 
    onChange, 
    error, 
    disabled, 
    className,
    required,
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("relative", className)}
      >
        {label && (
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
        
        <motion.div
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
        >
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              "placeholder-gray-500 dark:placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-200",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            {...props}
          />
          
          {/* Animated focus ring */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: focused ? 0.2 : 0, 
              scale: focused ? 1 : 0.95 
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

AnimatedInput.displayName = "AnimatedInput"