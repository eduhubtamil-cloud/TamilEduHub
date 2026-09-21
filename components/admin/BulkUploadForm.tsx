'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { bulkCreateDraftResource } from '@/app/admin/resources/actions'
import { Upload, X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

type FileStatus = 'pending' | 'uploading' | 'success' | 'error'

interface UploadFile {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
  dbId?: string
  title: string
  isDuplicate?: boolean
}

export function BulkUploadForm({ 
  onSuccess 
}: { 
  onSuccess?: () => void 
}) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const generateTitle = (filename: string) => {
    let title = filename.replace(/\.[^/.]+$/, "")
    title = title.replace(/[_-]/g, ' ')
    title = title.replace(/\s+/g, ' ').trim()
    return title
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const MAX_FILE_SIZE = 50 * 1024 * 1024
    const allowedTypes = ['application/pdf']
    
    const newFiles: UploadFile[] = Array.from(e.target.files).map(file => {
      let status: FileStatus = 'pending'
      let error = undefined

      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
        status = 'error'
        error = 'Invalid file type. Only PDFs allowed.'
      } else if (file.size > MAX_FILE_SIZE) {
        status = 'error'
        error = 'File too large (Max 50MB)'
      }
      
      const title = generateTitle(file.name)

      return {
        id: Math.random().toString(36).substring(7),
        file,
        status,
        error,
        progress: 0,
        title
      }
    })

    // Avoid duplicates in the current list
    setFiles(prev => {
      const existingNames = new Set(prev.map(f => f.file.name))
      const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.file.name))
      return [...prev, ...uniqueNewFiles]
    })
    
    if (fileInputRef.current) fileInputRef.current.value = ''

    // Async check for duplicates in the DB
    const titlesToCheck = newFiles.map(f => f.title)
    if (titlesToCheck.length > 0) {
      try {
        const { data: existing } = await supabase
          .from('resources')
          .select('title')
          .in('title', titlesToCheck)
        
        if (existing && existing.length > 0) {
          const existingTitles = new Set(existing.map((r: any) => r.title.toLowerCase()))
          setFiles(prev => prev.map(f => {
            if (existingTitles.has(f.title.toLowerCase())) {
              return { ...f, isDuplicate: true }
            }
            return f
          }))
        }
      } catch (e) {
        console.error("Duplicate check failed", e)
      }
    }
  }

  const removeFile = (id: string) => {
    if (isUploading) return
    setFiles(prev => prev.filter(f => f.id !== id))
  }
  
  const updateTitle = (id: string, newTitle: string) => {
    if (isUploading) return
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title: newTitle } : f))
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6)
  }

  const startUpload = async () => {
    setIsUploading(true)
    
    const pendingFiles = files.filter(f => f.status === 'pending' || (f.status === 'error' && !f.error?.includes('Invalid') && !f.error?.includes('large')))
    let successCount = 0

    const { data: userData } = await supabase.auth.getUser()

    for (const f of pendingFiles) {
      setFiles(prev => prev.map(item => 
        item.id === f.id ? { ...item, status: 'uploading', progress: 10, error: undefined } : item
      ))

      try {
        const slug = generateSlug(f.title)
        const fileName = `uncategorized/${slug}.pdf`
        
        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(fileName, f.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, progress: 60 } : item
        ))

        const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(fileName)
        const fileUrl = publicUrlData.publicUrl
        
        const dbId = await bulkCreateDraftResource({
          title: f.title,
          slug,
          file_url: fileUrl,
          file_size: f.file.size
        })

        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, status: 'success', progress: 100, dbId } : item
        ))
        successCount++
      } catch (err: any) {
        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, status: 'error', error: err.message || 'Failed' } : item
        ))
      }
    }
    setIsUploading(false)
    if (successCount > 0 && onSuccess) {
      onSuccess()
    }
  }

  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag & Drop PDFs or Click to Select</h3>
        <p className="text-sm text-slate-500 mb-4">You can select multiple files at once. Files will be created as Drafts.</p>
        <Button disabled={isUploading} variant="outline" onClick={(e) => {
          e.stopPropagation()
          fileInputRef.current?.click()
        }}>
          Browse Files
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          multiple 
          accept="application/pdf"
        />
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50">
            <div>
              <h4 className="font-medium text-slate-700">Selected Files ({files.length})</h4>
              {(successCount > 0 || errorCount > 0) && (
                <p className="text-xs text-slate-500 mt-1">
                  Ready: {successCount} | Failed: {errorCount} | Pending: {files.length - successCount - errorCount}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button 
                size="sm"
                onClick={startUpload}
                disabled={isUploading || files.every(f => f.status === 'success')}
              >
                {isUploading ? 'Uploading...' : 'Start Upload'}
              </Button>
            </div>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className={`p-4 flex flex-col gap-2 ${file.isDuplicate && file.status === 'pending' ? 'bg-amber-50/50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-xs text-slate-500 truncate mb-1">File: {file.file.name}</p>
                        {file.isDuplicate && file.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            <AlertTriangle className="h-3 w-3" /> Possible Duplicate
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    
                    <Input 
                      value={file.title} 
                      onChange={(e) => updateTitle(file.id, e.target.value)}
                      disabled={file.status === 'uploading' || file.status === 'success'}
                      className="h-8 text-sm"
                      placeholder="Resource Title"
                    />

                    {file.status === 'uploading' && (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-12 justify-end shrink-0 pt-6">
                    {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {file.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {file.status === 'pending' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
