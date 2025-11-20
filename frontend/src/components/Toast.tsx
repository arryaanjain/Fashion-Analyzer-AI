import { useEffect, useState } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  const icon = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  }[type]

  return (
    <div
      className={`
        fixed bottom-6 right-6 flex items-center gap-3 ${bgColor} 
        text-white px-4 py-3 rounded-lg shadow-lg 
        animate-slide-in z-50 backdrop-blur-sm
      `}
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export default Toast
