'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

type FileStatus = 'pending' | 'uploading' | 'success' | 'error'

interface UploadFile {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
  dbId?: string
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending' as FileStatus,
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (id: string) => {
    if (isUploading) return
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6)
  }

  const startUpload = async () => {
    setIsUploading(true)
    
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error')
    let successCount = 0

    for (const f of pendingFiles) {
      setFiles(prev => prev.map(item => 
        item.id === f.id ? { ...item, status: 'uploading', progress: 10 } : item
      ))

      try {
        const fileExt = f.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
        
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
        
        const title = f.file.name.replace(/\.[^/.]+$/, "") 
        const { data: userData } = await supabase.auth.getUser()
        
        const { data: dbData, error: dbError } = await (supabase.from('resources') as any)
          .insert({
            title,
            slug: generateSlug(title),
            file_url: fileUrl,
            file_size: f.file.size,
            author_id: userData?.user?.id,
            status: 'draft'
          })
          .select('id')
          .single()

        if (dbError) throw dbError

        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, status: 'success', progress: 100, dbId: dbData.id } : item
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
            <h4 className="font-medium text-slate-700">Selected Files ({files.length})</h4>
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
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.file.name}</p>
                    <span className="text-xs text-slate-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  {file.status === 'uploading' && (
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${file.progress}%` }}></div>
                    </div>
                  )}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 w-24 justify-end shrink-0">
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
