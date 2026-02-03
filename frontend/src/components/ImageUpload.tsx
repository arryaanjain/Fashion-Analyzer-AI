import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  onImagesSelected: (images: string[]) => void
  isMobile?: boolean
}

const ImageUpload = ({ onImagesSelected, isMobile = false }: ImageUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imagePromises = acceptedFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then((images) => {
      onImagesSelected(images)
    })
  }, [onImagesSelected])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative cursor-pointer border-2 border-dashed rounded-xl transition-all duration-300
        ${isMobile
          ? 'p-2 w-12 h-12 flex items-center justify-center'
          : 'p-4'
        }
        ${isDragActive && !isDragReject
          ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg'
          : isDragReject
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-25 hover:to-purple-25'
        }
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {isMobile ? (
          // Mobile version - icon only
          <motion.div
            key="mobile"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center justify-center"
          >
            {isDragActive ? (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Camera className="w-5 h-5 text-pink-500" />
              </motion.div>
            ) : (
              <Upload className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        ) : (
          // Desktop version - with text
          <motion.div
            key="desktop"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            className="flex flex-col items-center space-y-2 text-center"
          >
            {isDragActive ? (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Camera className="w-8 h-8 text-pink-500" />
                </motion.div>
                <div className="text-sm text-pink-600 font-medium">
                  {isDragReject ? 'Please upload valid image files' : 'Drop images here!'}
                </div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-pink-400 rounded-full blur-md"
                    />
                  </div>
                </motion.div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Upload photos
                  </span>
                  <br />
                  <span className="text-xs">or drag & drop</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ImageUpload
