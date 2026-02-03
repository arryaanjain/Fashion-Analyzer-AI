import { motion } from 'framer-motion'

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-3"
        >
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-shimmer" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingSkeleton

