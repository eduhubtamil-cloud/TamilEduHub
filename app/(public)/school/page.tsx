import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'School Standards - TamilEduHub',
  description: 'Browse educational resources by standard for Tamil Nadu state board.',
}

export default function SchoolStandardsPage() {
  const standards = [
    { id: 12, name: '12th Standard' },
    { id: 11, name: '11th Standard' },
    { id: 10, name: '10th Standard' },
    { id: 9, name: '9th Standard' },
    { id: 8, name: '8th Standard' },
    { id: 7, name: '7th Standard' },
    { id: 6, name: '6th Standard' },
    { id: 5, name: '5th Standard' },
    { id: 4, name: '4th Standard' },
    { id: 3, name: '3th Standard' },
    { id: 2, name: '2nd Standard' },
    { id: 1, name: '1st Standard' },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">School Standards</h1>
        <p className="text-lg text-slate-600">
          Select your standard to find all related study materials, guides, and question papers.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {standards.map((std) => (
          <Link key={std.id} href={`/school/${std.id}th-standard`}>
            <Card className="hover:border-blue-500 hover:shadow-md transition-all h-full cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{std.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">View Resources</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
