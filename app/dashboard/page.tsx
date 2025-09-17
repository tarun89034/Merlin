'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, MessageSquare, FileText, Mic, BarChart3, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/utils'

export default function Dashboard() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Test backend connectivity on component mount
  useEffect(() => {
    testBackendConnection()
  }, [])

  const testBackendConnection = async () => {
    try {
      const result = await api.healthCheck()
      setConnectionStatus('connected')
      setTestResults(prev => ({ ...prev, healthCheck: result }))
    } catch (error) {
      setConnectionStatus('disconnected')
      setTestResults(prev => ({ ...prev, healthCheck: { error: 'Backend not reachable' } }))
    }
  }

  const testDocumentQA = async () => {
    setLoading(true)
    try {
      const result = await api.documentQA('What is machine learning?')
      setTestResults(prev => ({ ...prev, documentQA: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, documentQA: { error: 'Failed to test Document Q&A' } }))
    }
    setLoading(false)
  }

  const testSummarization = async () => {
    setLoading(true)
    try {
      const result = await api.summarize('This is a long text about artificial intelligence and machine learning that needs to be summarized for better understanding.')
      setTestResults(prev => ({ ...prev, summarization: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, summarization: { error: 'Failed to test Summarization' } }))
    }
    setLoading(false)
  }

  const testTextToSpeech = async () => {
    setLoading(true)
    try {
      const result = await api.textToSpeech('Hello, this is a test of the text-to-speech functionality.')
      setTestResults(prev => ({ ...prev, textToSpeech: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, textToSpeech: { error: 'Failed to test Text-to-Speech' } }))
    }
    setLoading(false)
  }

  const getAnalytics = async () => {
    setLoading(true)
    try {
      const result = await api.getAnalytics()
      setTestResults(prev => ({ ...prev, analytics: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, analytics: { error: 'Failed to fetch Analytics' } }))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">EduVision AI Dashboard</h1>
          <div className="flex items-center space-x-2">
            {connectionStatus === 'checking' && (
              <div className="flex items-center text-yellow-400">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full mr-2"></div>
                Checking...
              </div>
            )}
            {connectionStatus === 'connected' && (
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                Backend Connected
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                Backend Disconnected
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">System Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                Running (localhost:3000)
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Backend API</h3>
              <div className={`flex items-center ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                {connectionStatus === 'connected' ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {connectionStatus === 'connected' ? 'Connected (localhost:8000)' : 'Disconnected'}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
              <div className="flex items-center text-yellow-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                Not configured (Optional)
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">API Testing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={testDocumentQA}
              disabled={loading || connectionStatus !== 'connected'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <FileText className="w-6 h-6 mb-2" />
              Test Document Q&A
            </button>
            <button
              onClick={testSummarization}
              disabled={loading || connectionStatus !== 'connected'}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              Test Summarization
            </button>
            <button
              onClick={testTextToSpeech}
              disabled={loading || connectionStatus !== 'connected'}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <Mic className="w-6 h-6 mb-2" />
              Test Text-to-Speech
            </button>
            <button
              onClick={getAnalytics}
              disabled={loading || connectionStatus !== 'connected'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <BarChart3 className="w-6 h-6 mb-2" />
              Get Analytics
            </button>
          </div>
        </motion.div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Test Results</h2>
            <div className="space-y-4">
              {Object.entries(testResults).map(([key, result]: [string, any]) => (
                <div key={key} className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
