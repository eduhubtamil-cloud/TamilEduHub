'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'


export function BulkEditGrid({ 
  resources, 
  standards, 
  subjects, 
  mediums, 
  resourceTypes 
}: any) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Bulk application state
  const [bulkStandard, setBulkStandard] = useState<string>('')
  const [bulkSubject, setBulkSubject] = useState<string>('')
  const [bulkMedium, setBulkMedium] = useState<string>('')
  const [bulkType, setBulkType] = useState<string>('')

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
    if (bulkStandard) updates.standard_id = bulkStandard
    if (bulkSubject) updates.subject_id = bulkSubject
    if (bulkMedium) updates.medium_id = bulkMedium
    if (bulkType) updates.resource_type_id = bulkType

    if (Object.keys(updates).length === 0) {
      setIsUpdating(false)
      return
    }

    const { error } = await (supabase.from('resources') as any)
      .update(updates)
      .in('id', Array.from(selectedIds))

    if (error) {
      alert("Update failed: " + error.message)
    } else {
      alert("Resources updated successfully.")
      window.location.reload()
    }
    setIsUpdating(false)
  }

  const publishSelected = async () => {
    if (selectedIds.size === 0) return
    setIsUpdating(true)
    
    const { error } = await (supabase.from('resources') as any)
      .update({ status: 'published', published_at: new Date().toISOString() })
      .in('id', Array.from(selectedIds))

    if (error) {
      alert("Publish failed: " + error.message)
    } else {
      alert("Resources published successfully.")
      window.location.reload()
    }
    setIsUpdating(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border flex flex-wrap gap-4 items-end shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Apply Standard</label>
          <select value={bulkStandard} onChange={(e) => setBulkStandard(e.target.value)} className="w-[160px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">Standard...</option>
            {standards.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Apply Subject</label>
          <select value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)} className="w-[160px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">Subject...</option>
            {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 block mb-1">Apply Medium</label>
          <select value={bulkMedium} onChange={(e) => setBulkMedium(e.target.value)} className="w-[160px] bg-white border border-slate-300 rounded p-2 text-sm">
            <option value="">Medium...</option>
            {mediums.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <Button onClick={applyBulkEdit} disabled={isUpdating || selectedIds.size === 0}>
          Apply to Selected ({selectedIds.size})
        </Button>
        <Button onClick={publishSelected} variant="secondary" disabled={isUpdating || selectedIds.size === 0}>
          Publish Selected
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
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={selectedIds.has(r.id)} 
                    onChange={() => toggleOne(r.id)}
                  />
                </td>
                <td className="p-3 font-medium max-w-[300px] truncate" title={r.title}>{r.title}</td>
                <td className="p-3 text-slate-600">{r.standards?.name || '-'}</td>
                <td className="p-3 text-slate-600">{r.subjects?.name || '-'}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    r.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
