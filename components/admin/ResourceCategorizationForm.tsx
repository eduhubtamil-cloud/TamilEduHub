'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ResourceCategorizationForm({
  segments,
  standards,
  subjects,
  mediums,
  resourceTypes,
  examTypes = [],
  defaultValues = {}
}: any) {
  const [segmentId, setSegmentId] = useState(defaultValues.education_segment_id || '')

  const selectedSegment = segments.find((s: any) => s.id === segmentId)
  const isCompetitive = selectedSegment?.name?.toLowerCase().includes('competitive')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorization</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2 col-span-full md:col-span-2 bg-slate-50 p-4 rounded-lg border">
          <Label htmlFor="education_segment_id" className="text-base font-semibold">Audience / Education Segment *</Label>
          <select 
            id="education_segment_id" 
            name="education_segment_id" 
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
            className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
            required
          >
            <option value="">Select Audience</option>
            {segments.map((seg: any) => (
              <option key={seg.id} value={seg.id}>{seg.name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">This determines where the resource will be discovered on the public site.</p>
        </div>

        {/* Standard is hidden if it's competitive exams */}
        {!isCompetitive && (
          <div className="space-y-2">
            <Label htmlFor="standard_id">Standard *</Label>
            <select 
              id="standard_id" 
              name="standard_id" 
              defaultValue={defaultValues.standard_id || ''}
              className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
              required={!isCompetitive}
            >
              <option value="">Select Standard</option>
              {standards.map((std: any) => (
                <option key={std.id} value={std.id}>{std.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Exam Type is shown if it's competitive exams */}
        {isCompetitive && (
          <div className="space-y-2">
            <Label htmlFor="exam_type_id">Exam Type *</Label>
            <select 
              id="exam_type_id" 
              name="exam_type_id" 
              defaultValue={defaultValues.exam_type_id || ''}
              className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
              required={isCompetitive}
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((ext: any) => (
                <option key={ext.id} value={ext.id}>{ext.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="subject_id">Subject *</Label>
          <select 
            id="subject_id" 
            name="subject_id" 
            defaultValue={defaultValues.subject_id || ''}
            className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub: any) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medium_id">Medium</Label>
          <select 
            id="medium_id" 
            name="medium_id" 
            defaultValue={defaultValues.medium_id || ''}
            className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Medium</option>
            {mediums.map((med: any) => (
              <option key={med.id} value={med.id}>{med.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resource_type_id">Resource Type</Label>
          <select 
            id="resource_type_id" 
            name="resource_type_id" 
            defaultValue={defaultValues.resource_type_id || ''}
            className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Type</option>
            {resourceTypes.map((type: any) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            defaultValue={defaultValues.year || ''}
            placeholder="2026" 
          />
        </div>
      </CardContent>
    </Card>
  )
}
