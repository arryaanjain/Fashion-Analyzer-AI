import { motion } from 'framer-motion'
import { Sparkles, Camera, Palette, TrendingUp, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onGetStarted: () => void
}

const features = [
  {
    icon: Camera,
    title: "AI-Powered Analysis",
    description: "Upload photos for instant outfit feedback"
  },
  {
    icon: Palette,
    title: "Color Matching",
    description: "Get personalized color recommendations"
  },
  {
    icon: TrendingUp,
    title: "Trend Insights",
    description: "Stay updated with latest fashion trends"
  },
  {
    icon: Zap,
    title: "Instant Advice",
    description: "Real-time styling suggestions"
  }
]

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6"
    >
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Stylette
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal AI fashion stylist powered by advanced AI and real fashion data.
            Get instant outfit analysis, color matching, and personalized style advice.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started ✨
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-6 py-4 border border-pink-200">
            <p className="text-sm text-gray-700">
              💡 <span className="font-semibold">Pro Tip:</span> Upload multiple outfit photos for comprehensive analysis
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WelcomeScreen

