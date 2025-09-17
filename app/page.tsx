'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, MessageSquare, FileText, Mic, BarChart3, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [activeFeature, setActiveFeature] = useState('document-qa')
  const router = useRouter()

  const features = [
    {
      id: 'document-qa',
      title: 'Document Q&A',
      description: 'Upload lecture slides and ask questions about the content',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'visual-qa',
      title: 'Visual Analysis',
      description: 'Analyze diagrams, graphs, and figures with AI',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      id: 'summarization',
      title: 'Smart Summaries',
      description: 'Get bite-sized notes from lengthy lectures',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      id: 'text-to-speech',
      title: 'Text-to-Speech',
      description: 'Listen to summaries for better accessibility',
      icon: Mic,
      color: 'bg-orange-500'
    }
  ]

  const handleGetStarted = () => {
    router.push('/features')
  }

  const handleSignIn = () => {
    router.push('/signin')
  }

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId)
    router.push('/features')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">EduVision AI</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <button 
              onClick={handleSignIn}
              className="text-white hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            The Future of
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {' '}Learning
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            EduVision AI transforms how you learn with advanced multimodal AI capabilities. 
            Upload documents, analyze visuals, and get personalized insights powered by cutting-edge technology.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Start Learning Now
            </button>
            <button 
              onClick={() => router.push('/features')}
              className="border border-gray-400 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Try Features
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful AI Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the next generation of educational technology with our comprehensive suite of AI-powered tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => handleFeatureClick(feature.id)}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 EduVision AI. Transforming education through artificial intelligence.</p>
        </div>
      </footer>
    </div>
  )
}
