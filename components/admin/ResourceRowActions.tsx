'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, CheckCircle, XCircle, Archive } from 'lucide-react'
import Link from 'next/link'
import { deleteResource, updateResourceStatus } from '@/app/admin/resources/actions'

export function ResourceRowActions({ 
  id, 
  status 
}: { 
  id: string, 
  status: string 
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this resource? It will be moved to the trash.')) {
      setIsDeleting(true)
      try {
        await deleteResource(id)
      } catch (e) {
        console.error(e)
        alert('Failed to delete resource')
        setIsDeleting(false)
      }
    }
  }

  const handleArchive = async () => {
    if (confirm('Are you sure you want to archive this resource? It will be hidden from the public.')) {
      setIsUpdating(true)
      try {
        await updateResourceStatus(id, 'archived')
      } catch (e) {
        console.error(e)
        alert('Failed to archive resource')
        setIsUpdating(false)
      }
    }
  }

  const handleToggleStatus = async () => {
    setIsUpdating(true)
    try {
      await updateResourceStatus(id, status === 'published' ? 'draft' : 'published')
    } catch (e) {
      console.error(e)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        onClick={handleToggleStatus}
        disabled={isUpdating || isDeleting}
        title={status === 'published' ? 'Unpublish' : 'Publish'}
      >
        {status === 'published' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        onClick={handleArchive}
        disabled={isUpdating || isDeleting || status === 'archived'}
        title="Archive Resource"
      >
        <Archive className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100" asChild>
        <Link href={`/admin/resources/${id}/edit`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleDelete}
        disabled={isDeleting || status === 'deleted'}
        title="Delete Resource"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )
}
