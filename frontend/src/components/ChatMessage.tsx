import type { ReactNode } from 'react'
import { Bot, User } from 'lucide-react'

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
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[80%] flex-row items-start space-x-3">
        {/* Bot Avatar */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
          style={{backgroundColor: '#4c1207'}}
        >
          <Bot className="w-5 h-5" />
        </div>

        {/* Bot Message Content */}
        <div className="rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-200">
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {message.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
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

          {/* Timestamp */}
          <div className="text-xs mt-2 text-gray-400">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

// User Message Component
const UserMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex max-w-[80%] flex-row-reverse items-start space-x-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-200 text-gray-600">
          <User className="w-5 h-5" />
        </div>

        {/* User Message Content */}
        <div 
          className="rounded-2xl px-4 py-3 shadow-sm text-white"
          style={{backgroundColor: '#4c1207'}}
        >
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {message.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
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
          <div className="text-xs mt-2 text-white">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
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
