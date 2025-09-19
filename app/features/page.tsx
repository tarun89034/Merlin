'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, MessageSquare, FileText, Mic, BarChart3, Send, Play, Pause } from 'lucide-react'
import { api } from '@/lib/utils'

export default function Features() {
  const [activeTab, setActiveTab] = useState('document-qa')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})

  // Document Q&A State
  const [question, setQuestion] = useState('')
  const [documentId, setDocumentId] = useState('')

  // Visual Q&A State
  const [visualQuestion, setVisualQuestion] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Summarization State
  const [textToSummarize, setTextToSummarize] = useState('')
  const [maxLength, setMaxLength] = useState(150)

  // Text-to-Speech State
  const [textToSpeak, setTextToSpeak] = useState('')
  const [voice, setVoice] = useState('default')
  const [isPlaying, setIsPlaying] = useState(false)
  const [ttsText, setTtsText] = useState('')

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDocumentQA = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    try {
      const result = await api.documentQA(question, documentId || undefined)
      setResults(prev => ({ ...prev, documentQA: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, documentQA: { error: 'Failed to process question' } }))
    }
    setLoading(false)
  }

  const handleVisualQA = async () => {
    if (!visualQuestion.trim() || !selectedImage) return
    
    setLoading(true)
    try {
      const result = await api.visualQA(visualQuestion, selectedImage)
      setResults(prev => ({ ...prev, visualQA: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, visualQA: { error: 'Failed to analyze image' } }))
    }
    setLoading(false)
  }

  const handleSummarization = async () => {
    if (!textToSummarize.trim()) return
    
    setLoading(true)
    try {
      const result = await api.summarize(textToSummarize, maxLength)
      setResults(prev => ({ ...prev, summarization: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, summarization: { error: 'Failed to generate summary' } }))
    }
    setLoading(false)
  }

  const handleTextToSpeech = async () => {
    if (!textToSpeak.trim()) return
    
    setLoading(true)
    try {
      const result = await api.textToSpeech(textToSpeak, voice)
      setResults(prev => ({ ...prev, textToSpeech: result }))
      setTtsText(textToSpeak)
      // Simulate audio playback
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 3000)
    } catch (error) {
      setResults(prev => ({ ...prev, textToSpeech: { error: 'Failed to generate speech' } }))
    }
    setLoading(false)
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)
    
    try {
      const result = await api.uploadFile(selectedFile)
      setResults(prev => ({ ...prev, fileUpload: result }))
      setUploadProgress(100)
      if (result && result.document_id) {
        setDocumentId(String(result.document_id))
      }
    } catch (error) {
      setResults(prev => ({ ...prev, fileUpload: { error: 'Failed to upload file' } }))
    }
    
    clearInterval(progressInterval)
    setLoading(false)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const playTTSAudio = (ttsResult: any) => {
    if (!ttsResult) {
      alert('No TTS result available')
      return
    }

    // Check if it's a Web Speech API fallback
    if (ttsResult.audio_url && ttsResult.audio_url.startsWith('webspeech:')) {
      const text = ttsResult.audio_url.replace('webspeech:', '')
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Set voice based on selection
        const voices = speechSynthesis.getVoices()
        if (voice === 'female' && voices.length > 1) {
          utterance.voice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[1]
        } else if (voice === 'male' && voices.length > 0) {
          utterance.voice = voices.find(voice => voice.name.toLowerCase().includes('male')) || voices[0]
        }
        
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8
        
        speechSynthesis.speak(utterance)
      } else {
        alert('Text-to-speech is not supported in your browser')
      }
      return
    }

    // Try to play the audio file from backend
    if (ttsResult.audio_url) {
      const audio = new Audio(ttsResult.audio_url)
      
      audio.onloadstart = () => {
        console.log('Loading audio...')
      }
      
      audio.oncanplay = () => {
        console.log('Audio ready to play')
        audio.play().catch(error => {
          console.error('Audio playback failed:', error)
          // Fallback to Web Speech API
          if ('speechSynthesis' in window && ttsText) {
            const utterance = new SpeechSynthesisUtterance(ttsText)
            speechSynthesis.speak(utterance)
          }
        })
      }
      
      audio.onerror = (error) => {
        console.error('Audio loading failed:', error)
        // Fallback to Web Speech API
        if ('speechSynthesis' in window && ttsText) {
          const utterance = new SpeechSynthesisUtterance(ttsText)
          speechSynthesis.speak(utterance)
        } else {
          alert('Audio playback failed and Web Speech API is not available')
        }
      }
      
      // Load the audio
      audio.load()
    } else {
      alert('No audio URL available')
    }
  }

  const tabs = [
    { id: 'document-qa', label: 'Document Q&A', icon: FileText },
    { id: 'visual-qa', label: 'Visual Analysis', icon: BarChart3 },
    { id: 'summarization', label: 'Summarization', icon: MessageSquare },
    { id: 'text-to-speech', label: 'Text-to-Speech', icon: Mic },
    { id: 'upload', label: 'Upload Files', icon: Upload }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white">EduVision AI Features</h1>
        <p className="text-gray-300 mt-2">Interactive AI-powered educational tools</p>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>

            {/* Document Q&A */}
            {activeTab === 'document-qa' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document ID (optional)
                  </label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="Enter document ID from upload"
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Question
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about your document..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleDocumentQA}
                  disabled={loading || !question.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Ask Question'}</span>
                </button>
              </div>
            )}

            {/* Visual Q&A */}
            {activeTab === 'visual-qa' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 max-w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Question about the image
                  </label>
                  <textarea
                    value={visualQuestion}
                    onChange={(e) => setVisualQuestion(e.target.value)}
                    placeholder="What would you like to know about this image?"
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleVisualQA}
                  disabled={loading || !visualQuestion.trim() || !selectedImage}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{loading ? 'Analyzing...' : 'Analyze Image'}</span>
                </button>
              </div>
            )}

            {/* Summarization */}
            {activeTab === 'summarization' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text to Summarize
                  </label>
                  <textarea
                    value={textToSummarize}
                    onChange={(e) => setTextToSummarize(e.target.value)}
                    placeholder="Paste your text here to get a concise summary..."
                    rows={6}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Length: {maxLength} words
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={maxLength}
                    onChange={(e) => setMaxLength(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={handleSummarization}
                  disabled={loading || !textToSummarize.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{loading ? 'Summarizing...' : 'Generate Summary'}</span>
                </button>
              </div>
            )}

            {/* Text-to-Speech */}
            {activeTab === 'text-to-speech' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text to Convert
                  </label>
                  <textarea
                    value={textToSpeak}
                    onChange={(e) => setTextToSpeak(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voice
                  </label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="default">Default</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <button
                  onClick={handleTextToSpeech}
                  disabled={loading || !textToSpeak.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{loading ? 'Generating...' : isPlaying ? 'Playing...' : 'Generate Speech'}</span>
                </button>
              </div>
            )}

            {/* File Upload */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <button
                  onClick={handleFileUpload}
                  disabled={loading || !selectedFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{loading ? 'Uploading...' : 'Upload File'}</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
            
            {results.documentQA && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Answer:</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {typeof results.documentQA === 'string' ? results.documentQA : results.documentQA.answer || JSON.stringify(results.documentQA, null, 2)}
                </div>
                {results.documentQA.document_title && (
                  <p className="text-sm text-gray-400 mt-2">Source: {results.documentQA.document_title}</p>
                )}
                {results.documentQA.confidence && (
                  <p className="text-sm text-gray-400">Confidence: {results.documentQA.confidence}</p>
                )}
              </div>
            )}
            {results.visualQA && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Visual Analysis Result:</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {typeof results.visualQA === 'string' ? results.visualQA : results.visualQA.answer || JSON.stringify(results.visualQA, null, 2)}
                </div>
                {results.visualQA.image_analysis && (
                  <div className="mt-3 p-3 bg-white/5 rounded">
                    <p className="text-sm text-gray-400 font-medium">Image Analysis:</p>
                    <p className="text-sm text-gray-300">{results.visualQA.image_analysis}</p>
                  </div>
                )}
                {results.visualQA.confidence && (
                  <p className="text-sm text-gray-400 mt-2">Confidence: {results.visualQA.confidence}</p>
                )}
              </div>
            )}
            {results.summarization && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Summary:</h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-white/5 p-3 rounded border-l-4 border-blue-500">
                  {typeof results.summarization === 'string' ? results.summarization : results.summarization.summary || JSON.stringify(results.summarization, null, 2)}
                </div>
                {results.summarization.original_length && results.summarization.summary_length && (
                  <div className="mt-3 text-sm text-gray-400 flex gap-4">
                    <span>Original: {results.summarization.original_length} chars</span>
                    <span>Summary: {results.summarization.summary_length} chars</span>
                    <span>Compression: {results.summarization.compression_ratio}</span>
                  </div>
                )}
              </div>
            )}
            {results.textToSpeech && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Text-to-Speech Result:</h3>
                <div className="text-gray-300">
                  {typeof results.textToSpeech === 'string' ? results.textToSpeech : results.textToSpeech.message || JSON.stringify(results.textToSpeech, null, 2)}
                </div>
                {results.textToSpeech.word_count && (
                  <div className="mt-3 text-sm text-gray-400 flex gap-4">
                    <span>Words: {results.textToSpeech.word_count}</span>
                    <span>Duration: {results.textToSpeech.estimated_duration}</span>
                    <span>Voice: {results.textToSpeech.voice_used}</span>
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4">
                  <button 
                    onClick={() => playTTSAudio(results.textToSpeech)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Play Audio
                  </button>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-0"></div>
                  </div>
                </div>
              </div>
            )}
            {results.fileUpload && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Upload Result:</h3>
                <div className="text-gray-300">
                  {typeof results.fileUpload === 'string' ? results.fileUpload : results.fileUpload.message || JSON.stringify(results.fileUpload, null, 2)}
                </div>
                {results.fileUpload.document_id && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <p className="text-green-400 font-medium">✓ File processed successfully!</p>
                    <p className="text-sm text-gray-300 mt-1">Document ID: {results.fileUpload.document_id}</p>
                    {results.fileUpload.total_characters && (
                      <p className="text-sm text-gray-300">Extracted {results.fileUpload.total_characters} characters</p>
                    )}
                  </div>
                )}
                {results.fileUpload.extracted_text_preview && (
                  <div className="mt-3 p-3 bg-white/5 rounded">
                    <p className="text-sm text-gray-400 font-medium">Content Preview:</p>
                    <p className="text-sm text-gray-300 mt-1">{results.fileUpload.extracted_text_preview}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
