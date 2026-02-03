import { motion } from 'framer-motion'
import { Sparkles, Palette, TrendingUp, Heart, Shirt, Camera } from 'lucide-react'

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void
  isVisible: boolean
}

const prompts = [
  {
    icon: Camera,
    text: "Analyze my outfit",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Palette,
    text: "What colors suit me?",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: TrendingUp,
    text: "Latest fashion trends",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Heart,
    text: "Style suggestions for date night",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Shirt,
    text: "Professional outfit ideas",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Sparkles,
    text: "Mix and match tips",
    color: "from-amber-500 to-orange-500"
  }
]

const SuggestedPrompts = ({ onPromptClick, isVisible }: SuggestedPromptsProps) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          ✨ Try asking me about...
        </h3>
        <p className="text-sm text-gray-500">
          Click any suggestion or type your own question
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => {
          const Icon = prompt.icon
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPromptClick(prompt.text)}
              className="group relative overflow-hidden rounded-xl p-4 bg-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${prompt.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-left">
                  {prompt.text}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default SuggestedPrompts

