"use client"

import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { 
  User as UserIcon, 
  Settings, 
  FolderOpen, 
  BarChart3, 
  Bell, 
  Search,
  Plus,
  LogOut,
  Calendar,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

interface EnhancedDashboardProps {
  user: User
  onSignOut: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function EnhancedDashboard({ user, onSignOut }: EnhancedDashboardProps) {
  const stats = [
    { label: "Projects", value: "12", change: "+2", icon: FolderOpen, color: "from-blue-500 to-cyan-500" },
    { label: "Tasks", value: "45", change: "+8", icon: Activity, color: "from-emerald-500 to-teal-500" },
    { label: "Progress", value: "89%", change: "+12%", icon: TrendingUp, color: "from-violet-500 to-purple-500" },
    { label: "Days Active", value: "23", change: "+5", icon: Calendar, color: "from-orange-500 to-red-500" },
  ]

  const quickActions = [
    { label: "New Project", icon: Plus, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Settings", icon: Settings, color: "bg-slate-500 hover:bg-slate-600" },
    { label: "Analytics", icon: BarChart3, color: "bg-emerald-500 hover:bg-emerald-600" },
    { label: "Profile", icon: UserIcon, color: "bg-violet-500 hover:bg-violet-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <div className="w-6 h-6 bg-white rounded-lg opacity-90" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome back, {user.user_metadata?.full_name || 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSignOut}
                  className="gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Welcome Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2"
              >
                Good morning! ✨
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 mb-6"
              >
                You have 3 tasks due today and 2 meetings scheduled.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm">
                  View Today's Schedule
                </Button>
              </motion.div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl"></div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={itemVariants} className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${action.color} text-white rounded-2xl p-6 text-left shadow-lg transition-all duration-200`}
              >
                <action.icon className="h-6 w-6 mb-3" />
                <p className="font-medium">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.section variants={itemVariants}>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg">
              <div className="space-y-4">
                {[
                  { action: "Created new project", time: "2 hours ago", type: "project" },
                  { action: "Completed 3 tasks", time: "4 hours ago", type: "task" },
                  { action: "Updated profile", time: "Yesterday", type: "profile" },
                  { action: "Shared document", time: "2 days ago", type: "share" },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Recent Projects */}
          <motion.section variants={itemVariants}>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Recent Projects
            </h3>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg">
              <div className="space-y-4">
                {[
                  { name: "Website Redesign", progress: 75, color: "bg-blue-500" },
                  { name: "Mobile App", progress: 45, color: "bg-emerald-500" },
                  { name: "API Integration", progress: 90, color: "bg-purple-500" },
                  { name: "Database Migration", progress: 30, color: "bg-orange-500" },
                ].map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {project.name}
                      </h4>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        className={`${project.color} h-2 rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  )
}