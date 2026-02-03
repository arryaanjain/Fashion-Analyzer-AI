import type { ReactNode } from 'react'
import { Bot, User, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  images?: string[]
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

const formatBotMessage = (text: string): ReactNode[] => {
  // Convert markdown-style formatting to React elements for bot messages
  const lines = text.split('\n')
  const elements: ReactNode[] = []
  let bulletList: string[] = []
  
  const flushBulletList = () => {
    if (bulletList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc ml-6 mb-3 space-y-1">
          {bulletList.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      )
      bulletList = []
    }
  }
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    
    // Handle markdown headers (###, ##, #)
    if (trimmed.startsWith('###')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h4 key={index} className="font-bold text-base mt-4 mb-2 text-gray-900">
          {headerText}
        </h4>
      )
      return
    }
    
    if (trimmed.startsWith('##')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h3 key={index} className="font-bold text-lg mt-5 mb-3 text-gray-900">
          {headerText}
        </h3>
      )
      return
    }
    
    if (trimmed.startsWith('#')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h2 key={index} className="font-bold text-xl mt-6 mb-4 text-gray-900">
          {headerText}
        </h2>
      )
      return
    }
    
    // Handle bullet points and list items
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      let itemText = trimmed.substring(1).trim()
      
      // Replace inline formatting
      itemText = itemText.replace(/\*\*(.*?)\*\*/g, '$1')
      itemText = itemText.replace(/\*(.*?)\*/g, '$1')
      
      bulletList.push(itemText)
      return
    }
    
    // Flush bullet list if we hit a non-list line
    if (bulletList.length > 0 && trimmed !== '') {
      flushBulletList()
    }
    
    // Handle empty lines
    if (trimmed === '') {
      elements.push(<br key={index} />)
      return
    }
    
    // Handle regular text with formatting
    let formattedLine = line
    
    // Replace bold text
    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Replace italic text
    formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    elements.push(
      <p 
        key={index} 
        className="mb-3 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    )
  })
  
  // Flush any remaining bullet list
  flushBulletList()
  
  return elements
}

const formatUserMessage = (text: string): ReactNode[] => {
  // Convert markdown-style formatting to React elements for user messages (white text)
  const lines = text.split('\n')
  const elements: ReactNode[] = []
  let bulletList: string[] = []
  
  const flushBulletList = () => {
    if (bulletList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc ml-6 mb-3 space-y-1">
          {bulletList.map((item, idx) => (
            <li key={idx} className="text-white">
              {item}
            </li>
          ))}
        </ul>
      )
      bulletList = []
    }
  }
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    
    // Handle markdown headers (###, ##, #)
    if (trimmed.startsWith('###')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h4 key={index} className="font-bold text-base mt-4 mb-2 text-white">
          {headerText}
        </h4>
      )
      return
    }
    
    if (trimmed.startsWith('##')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h3 key={index} className="font-bold text-lg mt-5 mb-3 text-white">
          {headerText}
        </h3>
      )
      return
    }
    
    if (trimmed.startsWith('#')) {
      flushBulletList()
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
      elements.push(
        <h2 key={index} className="font-bold text-xl mt-6 mb-4 text-white">
          {headerText}
        </h2>
      )
      return
    }
    
    // Handle bullet points and list items
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      let itemText = trimmed.substring(1).trim()
      
      // Replace inline formatting
      itemText = itemText.replace(/\*\*(.*?)\*\*/g, '$1')
      itemText = itemText.replace(/\*(.*?)\*/g, '$1')
      
      bulletList.push(itemText)
      return
    }
    
    // Flush bullet list if we hit a non-list line
    if (bulletList.length > 0 && trimmed !== '') {
      flushBulletList()
    }
    
    // Handle empty lines
    if (trimmed === '') {
      elements.push(<br key={index} />)
      return
    }
    
    // Handle regular text with formatting
    let formattedLine = line
    
    // Replace bold text
    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Replace italic text
    formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    elements.push(
      <p 
        key={index} 
        className="mb-3 text-white leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    )
  })
  
  // Flush any remaining bullet list
  flushBulletList()
  
  return elements
}

// Bot Message Component
const BotMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-4"
    >
      <div className="flex max-w-[80%] flex-row items-start space-x-3">
        {/* Bot Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg"
          style={{backgroundColor: '#4c1207'}}
        >
          <Bot className="w-5 h-5" />
        </motion.div>

        {/* Bot Message Content */}
        <div className="relative group">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-200"
          >
            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2 max-w-xs">
                  {message.images.map((image, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-pink-400 transition-colors"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Text Content */}
            {message.text && (
              <div className="prose prose-sm max-w-none text-gray-700">
                {formatBotMessage(message.text)}
              </div>
            )}

            {/* Timestamp and Copy Button */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// User Message Component
const UserMessage = ({ message }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end mb-4"
    >
      <div className="flex max-w-[80%] flex-row-reverse items-start space-x-3 space-x-reverse">
        {/* User Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg"
        >
          <User className="w-5 h-5" />
        </motion.div>

        {/* User Message Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow text-white"
          style={{backgroundColor: '#4c1207'}}
        >
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {message.images.map((image, index) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Text Content */}
          {message.text && (
            <div className="prose prose-sm max-w-none text-white">
              {formatUserMessage(message.text)}
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs mt-2 text-white/70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main ChatMessage Component
const ChatMessage = ({ message }: ChatMessageProps) => {
  return message.sender === 'bot' ? (
    <BotMessage message={message} />
  ) : (
    <UserMessage message={message} />
  )
}

export default ChatMessage
