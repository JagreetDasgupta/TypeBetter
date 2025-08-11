// Fallback for when MongoDB is unavailable
export const fallbackData = {
  users: [],
  sessions: [],
  typingTests: [],
  leaderboard: []
}

export function createFallbackResponse(data: any = null, error: string = 'Database unavailable') {
  return {
    success: false,
    error,
    data: data || fallbackData
  }
}

export function isMongoError(error: any): boolean {
  return error?.name === 'MongoServerSelectionError' || 
         error?.name === 'MongoNetworkError' ||
         error?.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR'
}