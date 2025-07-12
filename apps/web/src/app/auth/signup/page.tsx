"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EnhancedAuthCard } from "@/components/ui/enhanced-auth-card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSignUp = async (data: { email: string; password: string; fullName?: string }) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Check your email for the confirmation link!")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }
  }

  const handleGithubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }
  }

  return (
    <EnhancedAuthCard
      title="Create your account"
      subtitle="Get started with your new account"
      mode="signup"
      onSubmit={handleSignUp}
      onGoogleAuth={handleGoogleSignUp}
      onGithubAuth={handleGithubSignUp}
      error={error || (success ? "" : error)}
      loading={loading}
    >
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center font-medium">{success}</p>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.4 }}
        className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
      >
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
        >
          Sign in
        </Link>
      </motion.div>
    </EnhancedAuthCard>
  )
}