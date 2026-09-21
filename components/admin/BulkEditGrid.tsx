'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { bulkPublishResources, bulkUpdateResources } from '@/app/admin/resources/actions'

export function BulkEditGrid({ 
  resources, 
  standards, 
  subjects, 
  mediums, 
  resourceTypes,
  segments,
  examTypes,
  publications
}: any) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [invalidIds, setInvalidIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Bulk application state
  const [bulkSegment, setBulkSegment] = useState<string>('')
  const [bulkStandard, setBulkStandard] = useState<string>('')
  const [bulkSubject, setBulkSubject] = useState<string>('')
  const [bulkMedium, setBulkMedium] = useState<string>('')
  const [bulkType, setBulkType] = useState<string>('')
  const [bulkExamType, setBulkExamType] = useState<string>('')
  const [bulkPublication, setBulkPublication] = useState<string>('')
  const [bulkYear, setBulkYear] = useState<string>('')
  const [bulkStatus, setBulkStatus] = useState<string>('')

  const supabase = createClient()

  const toggleAll = () => {
    if (selectedIds.size === resources.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(resources.map((r: any) => r.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const applyBulkEdit = async () => {
    if (selectedIds.size === 0) return
    setIsUpdating(true)
    
    const updates: any = {}
    if (bulkSegment) updates.education_segment_id = bulkSegment
    if (bulkStandard) updates.standard_id = bulkStandard
    if (bulkSubject) updates.subject_id = bulkSubject
    if (bulkMedium) updates.medium_id = bulkMedium
    if (bulkType) updates.resource_type_id = bulkType
    if (bulkExamType) updates.exam_type_id = bulkExamType
    if (bulkPublication) updates.publication_id = bulkPublication
    if (bulkYear) updates.year = parseInt(bulkYear)
    if (bulkStatus && bulkStatus !== 'publish') updates.status = bulkStatus

    if (Object.keys(updates).length === 0 && bulkStatus !== 'publish') {
      setIsUpdating(false)
      return
    }

    if (Object.keys(updates).length > 0) {
      try {
        await bulkUpdateResources(Array.from(selectedIds), updates)
      } catch (error: any) {
        alert("Update failed: " + error.message)
        setIsUpdating(false)
        return
      }
    }

    if (bulkStatus === 'publish') {
      await publishSelected()
    } else {
      alert("Resources updated successfully.")
      window.location.reload()
    }
    setIsUpdating(false)
  }

  const publishSelected = async () => {
    if (selectedIds.size === 0) return
    setIsUpdating(true)
    setInvalidIds(new Set())
    
    try {
      const result = await bulkPublishResources(Array.from(selectedIds))
      if (result.success) {
        alert(result.message)
        window.location.reload()
      } else {
        alert(result.message)
        if (result.invalidIds) {
          setInvalidIds(new Set(result.invalidIds))
        }
      }
    } catch (e: any) {
      alert("Publish failed: " + e.message)
    }
    setIsUpdating(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border flex flex-wrap gap-4 items-end shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Audience</label>
          <select value={bulkSegment} onChange={(e) => setBulkSegment(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {segments.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Standard</label>
          <select value={bulkStandard} onChange={(e) => setBulkStandard(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {standards.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Subject</label>
          <select value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Medium</label>
          <select value={bulkMedium} onChange={(e) => setBulkMedium(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {mediums.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Type</label>
          <select value={bulkType} onChange={(e) => setBulkType(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {resourceTypes.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Exam Type</label>
          <select value={bulkExamType} onChange={(e) => setBulkExamType(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">No change</option>
            {examTypes.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Action / Status</label>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="w-[140px] bg-white border border-slate-300 rounded p-2 text-sm font-medium text-blue-600">
            <option value="">No change</option>
            <option value="draft">Set to Draft</option>
            <option value="archived">Set to Archived</option>
            <option value="publish">Publish Selected</option>
          </select>
        </div>

        <Button onClick={applyBulkEdit} disabled={isUpdating || selectedIds.size === 0}>
          Apply to Selected ({selectedIds.size})
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-600">
            <tr>
              <th className="p-3 w-10">
                <input 
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={resources.length > 0 && selectedIds.size === resources.length} 
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Standard</th>
              <th className="p-3 font-medium">Subject</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No resources found matching criteria.</td>
              </tr>
            )}
            {resources.map((r: any) => (
              <tr key={r.id} className={`transition-colors ${invalidIds.has(r.id) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}>
                <td className="p-3">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={selectedIds.has(r.id)} 
                    onChange={() => toggleOne(r.id)}
                  />
                </td>
                <td className="p-3 font-medium max-w-[400px] truncate" title={r.title}>
                  {r.title}
                  {invalidIds.has(r.id) && <span className="ml-2 text-xs text-red-600 font-bold">Missing Metadata</span>}
                </td>
                <td className="p-3 text-slate-600">{r.standards?.name || '-'}</td>
                <td className="p-3 text-slate-600">{r.subjects?.name || '-'}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    r.status === 'published' ? 'bg-green-100 text-green-800' : 
                    r.status === 'archived' ? 'bg-slate-100 text-slate-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
