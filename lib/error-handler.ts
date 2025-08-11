// Global error handler for unhandled rejections
if (typeof window === 'undefined') {
  process.on('unhandledRejection', (reason, promise) => {
    if (reason && typeof reason === 'object' && 'name' in reason) {
      const error = reason as any
      if (error.name === 'MongoServerSelectionError' || 
          error.name === 'MongoNetworkError' ||
          error.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
        console.warn('MongoDB connection failed - running in offline mode')
        return
      }
    }
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  })
}