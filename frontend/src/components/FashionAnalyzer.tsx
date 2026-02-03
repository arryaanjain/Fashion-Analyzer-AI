import { useState, useRef, useCallback, useEffect } from 'react'
import axios from 'axios'
import { Send, Upload, X, Sparkles, Menu, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUpload from './ImageUpload'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import Toast from './Toast'
import WelcomeScreen from './WelcomeScreen'
import SuggestedPrompts from './SuggestedPrompts'
import QuickActions from './QuickActions'
import ImagePreview from './ImagePreview'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  images?: string[]
  timestamp: Date
}

interface ChatRequest {
  message: string
  images?: string[]
}

interface ChatResponse {
  response: string
  status: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FashionAnalyzer = () => {
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup fullscreen state on unmount
  useEffect(() => {
    return () => {
      // Reset body overflow when component unmounts
      document.body.style.overflow = ''
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', images?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      images,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    // Only auto-scroll for user messages, not bot responses
    if (sender === 'user') {
      setTimeout(scrollToBottom, 100)
    }
  }, [])

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return

    const userMessage = inputMessage.trim()
    const messagesToSend = uploadedImages.length > 0 ? [...uploadedImages] : undefined

    // Add user message
    addMessage(userMessage || 'Image analysis', 'user', messagesToSend)
    
    setInputMessage('')
    setUploadedImages([])
    setIsLoading(true)

    try {
      const requestData: ChatRequest = {
        message: userMessage || 'Analyze this outfit and give me styling advice',
        images: messagesToSend
      }

      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/api/chat`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 120000, // Increased to 120 seconds for image processing and dataset analysis
      })

      if (response.data.response) {
        addMessage(response.data.response, 'bot')
        setToastMessage({ text: '✨ Stylette Analysis Complete!', type: 'success' })
        setTimeout(scrollToBottom, 100)
      } else {
        addMessage('I apologize, but I encountered an issue processing your request. Please try again!', 'bot')
        setToastMessage({ text: '⚠️ No analysis received', type: 'error' })
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      let errorMessage = "I'm having trouble connecting to my analysis service right now."
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage += " The request timed out - fashion analysis can take a moment with images."
        } else if (error.response?.status === 404) {
          errorMessage += " The service appears to be unavailable."
        } else if ((error.response?.status ?? 0) >= 500) {
          errorMessage += " There's a server issue - please try again later."
        }
      }
      
      errorMessage += " Here's some general fashion advice:\n\n"
      
      if (userMessage.toLowerCase().includes('cute')) {
        errorMessage += "**Cute Outfit Ideas! 🎀**\n\n• Pastel sweater + high-waisted jeans + white sneakers\n• Floral dress + denim jacket + ankle boots\n• Keep colors soft and add cute accessories!\n\nYou're going to look adorable! 💕"
      } else if (userMessage.toLowerCase().includes('party')) {
        errorMessage += "**Party Perfect! 🎉**\n\n• Sequin top + black pants + heels\n• Little black dress + statement jewelry\n• Bold makeup and confidence!\n\nDance the night away! ✨"
      } else {
        errorMessage += "**General Fashion Tips:**\n\n• Balance proportions (fitted + loose)\n• Stick to 2-3 colors max\n• Confidence is your best accessory!\n\nFeel free to ask more specific questions! 💕"
      }
      
      addMessage(errorMessage, 'bot')
      setToastMessage({ text: '⚠️ Stylette Connection Issue', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }


  const handleImagesSelected = (images: string[]) => {
    setUploadedImages(images)
    if (showWelcome) {
      setShowWelcome(false)
    }
  }

  const handleGetStarted = () => {
    setShowWelcome(false)
    setMessages([
      {
        id: '1',
        text: '✨ Hi there! I\'m Stylette, your AI fashion stylist. Upload outfit photos or ask me fashion questions - I\'m here to help you look absolutely stunning! 👗✨',
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt)
    if (showWelcome) {
      setShowWelcome(false)
      setMessages([
        {
          id: '1',
          text: '✨ Hi there! I\'m Stylette, your AI fashion stylist. Let me help you with that! 👗✨',
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    }
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
  }

  const handleImageUploadClick = () => {
    // Trigger the file input from ImageUpload component
    const uploadButton = document.querySelector('input[type="file"]') as HTMLInputElement
    uploadButton?.click()
  }

  const handleClearChat = () => {
    setMessages([])
    setShowWelcome(true)
    setUploadedImages([])
    setInputMessage('')
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header - Fixed height, responsive */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="flex-none text-white shadow-xl backdrop-blur-sm"
        style={{backgroundColor: '#4c1207'}}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Stylette</h1>
                <p className="text-sm text-pink-100 hidden sm:block">Your AI Fashion Stylist</p>
              </div>
            </div>

            {/* Clear Chat Button */}
            {!showWelcome && messages.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearChat}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Chat Messages Area - Flexible height with proper scrolling */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Quick Actions Bar */}
              {messages.length <= 1 && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-none border-b border-gray-200 bg-white/50 backdrop-blur-sm"
                >
                  <QuickActions
                    onActionClick={handleQuickAction}
                    onImageUpload={handleImageUploadClick}
                  />
                </motion.div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4 custom-scrollbar">
                {/* Suggested Prompts - Show only when no messages */}
                {messages.length === 0 && (
                  <SuggestedPrompts
                    onPromptClick={handlePromptClick}
                    isVisible={messages.length === 0}
                  />
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Upload Preview */}
        {!showWelcome && uploadedImages.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-none px-4 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-200"
          >
            <ImagePreview images={uploadedImages} onRemove={removeImage} />
          </motion.div>
        )}
      </main>

      {/* Input Area - Fixed at bottom, responsive */}
      {!showWelcome && (
        <motion.footer
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex-none bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-2xl"
        >
          <div className="px-4 py-4 sm:px-6">
            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about fashion or upload photos..."
                  className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  <ImageUpload onImagesSelected={handleImagesSelected} isMobile={true} />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={isLoading || (!inputMessage.trim() && uploadedImages.length === 0)}
                    className="w-12 h-12 text-white rounded-xl hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    style={{backgroundColor: '#4c1207'}}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-end gap-4">
              <div className="flex-none">
                <ImageUpload onImagesSelected={handleImagesSelected} />
              </div>
              <div className="flex-1 flex gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about fashion, upload outfit photos, or get styling advice..."
                  className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all shadow-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || (!inputMessage.trim() && uploadedImages.length === 0)}
                  className="px-6 py-3 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl font-medium"
                  style={{backgroundColor: '#4c1207'}}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
          </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-center"
            >
              <p className="text-xs text-gray-500">
                💡 <span className="font-medium">Stylette Tip:</span> Upload photos or ask questions like "Does this look good?" or "What should I wear?"
              </p>
            </motion.div>
          </div>
        </motion.footer>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          duration={3000}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  )
}

export default FashionAnalyzer
