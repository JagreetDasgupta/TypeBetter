"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const populateDummyData = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/admin/populate-dummy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to populate dummy data', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>
        
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Database Management</h2>
          
          <div className="space-y-4">
            <Button 
              onClick={populateDummyData}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Populating...' : 'Populate Dummy Leaderboard Data'}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 rounded-lg bg-slate-700/50">
                <pre className="text-sm text-white overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}