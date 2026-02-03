import { Bot, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex flex-row items-start space-x-3">
        {/* Avatar */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{backgroundColor: '#4c1207'}}
        >
          <Bot className="w-5 h-5" />
        </motion.div>

        {/* Typing Animation */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100/50 to-transparent"
          />

          <div className="flex items-center space-x-1 relative z-10">
            <Sparkles className="w-4 h-4 text-pink-500 mr-1" />
            <div className="text-sm text-gray-600 mr-2 font-medium">Analyzing your style</div>
            <div className="flex space-x-1">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator
