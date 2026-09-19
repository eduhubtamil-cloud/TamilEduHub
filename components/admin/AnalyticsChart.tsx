'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function AnalyticsChart() {
  const [data, setData] = useState<{ date: string; downloads: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const supabase = createClient()
        
        // Calculate date 7 days ago
        const dateOffset = (24 * 60 * 60 * 1000) * 7
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setTime(sevenDaysAgo.getTime() - dateOffset)
        
        const { data: downloads, error } = await (supabase.from('downloads') as any)
          .select('created_at')
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Failed to fetch analytics:', error)
          setLoading(false)
          return
        }

        // Initialize buckets for the last 7 days
        const buckets: Record<string, number> = {}
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          buckets[dateStr] = 0
        }

        // Aggregate downloads into buckets
        if (downloads) {
          downloads.forEach((d: any) => {
            const date = new Date(d.created_at)
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (buckets[dateStr] !== undefined) {
              buckets[dateStr]++
            }
          })
        }

        // Format for Recharts
        const chartData = Object.keys(buckets).map(key => ({
          date: key,
          downloads: buckets[key]
        }))

        setData(chartData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Download Activity</CardTitle>
        <CardDescription>PDF downloads over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="downloads" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDownloads)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
