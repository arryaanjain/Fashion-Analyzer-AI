import { motion } from 'framer-motion'
import { Camera, Palette, Sparkles, TrendingUp, RefreshCw } from 'lucide-react'

interface QuickActionsProps {
  onActionClick: (action: string) => void
  onImageUpload: () => void
}

const actions = [
  {
    icon: Camera,
    label: "Upload Photo",
    action: "upload",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Palette,
    label: "Color Match",
    action: "What colors would look good on me?",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: TrendingUp,
    label: "Trends",
    action: "What are the latest fashion trends?",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Sparkles,
    label: "Style Tips",
    action: "Give me some styling tips",
    gradient: "from-amber-500 to-orange-500"
  }
]

const QuickActions = ({ onActionClick, onImageUpload }: QuickActionsProps) => {
  const handleClick = (action: string) => {
    if (action === "upload") {
      onImageUpload()
    } else {
      onActionClick(action)
    }
  }

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap px-4 py-3">
      {actions.map((action, index) => {
        const Icon = action.icon
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(action.action)}
            className="group relative overflow-hidden rounded-xl px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative flex items-center space-x-2">
              <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                {action.label}
              </span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export default QuickActions

