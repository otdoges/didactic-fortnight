"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EnhancedAuthCard } from "@/components/ui/enhanced-auth-card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignIn = async (data: { email: string; password: string }) => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
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

  const handleGithubSignIn = async () => {
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
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      mode="signin"
      onSubmit={handleSignIn}
      onGoogleAuth={handleGoogleSignIn}
      onGithubAuth={handleGithubSignIn}
      error={error}
      loading={loading}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.4 }}
        className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
      >
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
        >
          Sign up
        </Link>
      </motion.div>
    </EnhancedAuthCard>
  )
}