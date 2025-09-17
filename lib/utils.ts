import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API base URL
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:8000'

// API client functions
export const api = {
  // Test backend connectivity
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      return await response.json()
    } catch (error) {
      console.error('Backend health check failed:', error)
      throw error
    }
  },

  // Document Q&A
  async documentQA(question: string, documentId?: string) {
    try {
      const formData = new FormData()
      formData.append('question', question)
      formData.append('document_id', documentId || '1')
      
      const response = await fetch(`${API_BASE_URL}/document-qa`, {
        method: 'POST',
        body: formData,
      })
      return await response.json()
    } catch (error) {
      console.error('Document QA failed:', error)
      return { error: 'Failed to process question' }
    }
  },

  // Visual Q&A
  async visualQA(question: string, imageFile: File) {
    try {
      const formData = new FormData()
      formData.append('question', question)
      formData.append('image', imageFile)
      
      const response = await fetch(`${API_BASE_URL}/visual-qa`, {
        method: 'POST',
        body: formData,
      })
      return await response.json()
    } catch (error) {
      console.error('Visual QA failed:', error)
      return { error: 'Failed to analyze image' }
    }
  },

  // Text summarization
  async summarize(text: string, maxLength?: number) {
    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('max_length', (maxLength || 150).toString())
      
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        body: formData,
      })
      return await response.json()
    } catch (error) {
      console.error('Summarization failed:', error)
      return { error: 'Failed to generate summary' }
    }
  },

  // Text-to-Speech
  async textToSpeech(text: string, voice?: string) {
    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('voice', voice || 'default')
      
      const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
        method: 'POST',
        body: formData,
      })
      return await response.json()
    } catch (error) {
      console.error('Text-to-Speech failed:', error)
      return { error: 'Failed to generate speech' }
    }
  },

  // File upload
  async uploadFile(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })
      return await response.json()
    } catch (error) {
      console.error('File upload failed:', error)
      return { error: 'Failed to upload file' }
    }
  },

  // Get analytics
  async getAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`)
      return await response.json()
    } catch (error) {
      console.error('Analytics fetch failed:', error)
      throw error
    }
  }
}
