'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FileUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export function CsvImportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  const parseCsv = async () => {
    if (!csvFile) return
    setIsProcessing(true)
    
    try {
      const text = await csvFile.text()
      const lines = text.split('\n').filter(l => l.trim() !== '')
      if (lines.length < 2) throw new Error("CSV must contain a header and at least one row.")
      
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
      
      // Fetch taxonomies for mapping
      const [{ data: standards }, { data: subjects }] = await Promise.all([
        supabase.from('standards').select('id, name, slug'),
        supabase.from('subjects').select('id, name, slug')
      ])

      const stdMap = new Map((standards as any[] || []).map(s => [s.name.toLowerCase(), s.id]))
      const subMap = new Map((subjects as any[] || []).map(s => [s.name.toLowerCase(), s.id]))

      const rows = lines.slice(1).map((line, index) => {
        // Simple split (does not handle quoted commas, but good enough for MVP)
        const values = line.split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((h, i) => { row[h] = values[i] })
        
        let isValid = true
        let errors = []

        if (!row.filename) { isValid = false; errors.push("Missing filename") }
        if (!row.title) { isValid = false; errors.push("Missing title") }
        
        const standardId = stdMap.get((row.standard || '').toLowerCase())
        if (!standardId && row.standard) { isValid = false; errors.push(`Unknown standard: ${row.standard}`) }
        
        const subjectId = subMap.get((row.subject || '').toLowerCase())
        if (!subjectId && row.subject) { isValid = false; errors.push(`Unknown subject: ${row.subject}`) }

        return {
          original: row,
          mapped: {
            title: row.title,
            standard_id: standardId,
            subject_id: subjectId,
            year: row.year ? parseInt(row.year) : null,
          },
          isValid,
          errors
        }
      })
      
      setParsedRows(rows)
    } catch (e: any) {
      alert("Failed to parse CSV: " + e.message)
    }
    setIsProcessing(false)
  }

  const importData = async () => {
    setIsProcessing(true)
    try {
      const validRows = parsedRows.filter(r => r.isValid)
      const { data: userData } = await supabase.auth.getUser()

      // In a real production scenario, we would match filename against uploaded storage.
      // For this workflow step, we'll insert them as drafts.
      const inserts = validRows.map(r => {
        const slug = r.mapped.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6)
        return {
          title: r.mapped.title,
          slug,
          standard_id: r.mapped.standard_id,
          subject_id: r.mapped.subject_id,
          year: r.mapped.year,
          status: 'draft',
          author_id: userData?.user?.id
        }
      })

      const { error } = await (supabase.from('resources') as any).insert(inserts)
      if (error) throw error
      
      alert(`Successfully imported ${validRows.length} draft resources!`)
      setIsOpen(false)
      window.location.reload()
    } catch (e: any) {
      alert("Failed to import: " + e.message)
    }
    setIsProcessing(false)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2">
        <FileUp className="h-4 w-4" /> Import CSV
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold">Import Metadata via CSV</h2>
                <p className="text-sm text-slate-500">Headers must include: filename, title, standard, subject</p>
              </div>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Close</Button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {!parsedRows.length ? (
                <div className="flex items-center gap-4">
                  <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <Button onClick={parseCsv} disabled={!csvFile || isProcessing}>Parse CSV</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-semibold">Review Import</p>
                      <p className="text-sm">Found {parsedRows.length} rows. {parsedRows.filter(r => r.isValid).length} are valid.</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="p-3">Status</th>
                          <th className="p-3">Filename</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">Standard</th>
                          <th className="p-3">Errors</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {parsedRows.map((r, i) => (
                          <tr key={i} className={r.isValid ? '' : 'bg-red-50'}>
                            <td className="p-3">{r.isValid ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}</td>
                            <td className="p-3 font-mono text-xs">{r.original.filename}</td>
                            <td className="p-3">{r.original.title}</td>
                            <td className="p-3">{r.original.standard}</td>
                            <td className="p-3 text-red-600 text-xs">{r.errors.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {parsedRows.length > 0 && (
              <div className="p-6 border-t bg-slate-50 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setParsedRows([])}>Reset</Button>
                <Button onClick={importData} disabled={isProcessing || parsedRows.filter(r => r.isValid).length === 0}>
                  Import {parsedRows.filter(r => r.isValid).length} Valid Records
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
