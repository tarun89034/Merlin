'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Demo credentials for different roles
  const demoCredentials = {
    admin: { email: 'admin@eduvision.ai', password: 'admin123' },
    teacher: { email: 'teacher@eduvision.ai', password: 'teacher123' },
    student: { email: 'student@eduvision.ai', password: 'student123' }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials and determine role
    let userRole = null
    for (const [role, creds] of Object.entries(demoCredentials)) {
      if (email === creds.email && password === creds.password) {
        userRole = role
        break
      }
    }

    if (userRole) {
      // Store user info in localStorage (in production, use proper auth)
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('userEmail', email)
      
      // Redirect based on role
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard')
          break
        case 'teacher':
          router.push('/teacher/dashboard')
          break
        case 'student':
          router.push('/features')
          break
        default:
          router.push('/features')
      }
    } else {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  const handleDemoLogin = (role: string) => {
    const creds = demoCredentials[role as keyof typeof demoCredentials]
    setEmail(creds.email)
    setPassword(creds.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to EduVision AI</p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-300 mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="block w-full text-left text-blue-300 hover:text-blue-200 transition-colors"
            >
              👑 Admin: admin@eduvision.ai / admin123
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              className="block w-full text-left text-green-300 hover:text-green-200 transition-colors"
            >
              🎓 Teacher: teacher@eduvision.ai / teacher123
            </button>
            <button
              onClick={() => handleDemoLogin('student')}
              className="block w-full text-left text-purple-300 hover:text-purple-200 transition-colors"
            >
              📚 Student: student@eduvision.ai / student123
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
