import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { BulkUploadForm } from '@/components/admin/BulkUploadForm'

export const metadata = {
  title: 'Bulk Upload Resources - TamilEduHub CMS',
}

export default function BulkUploadPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/resources">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bulk Upload PDFs</h1>
            <p className="text-slate-500">Quickly upload multiple files. They will be saved as Drafts.</p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link href="/admin/resources/bulk-edit">
            <Edit className="h-4 w-4 mr-2" />
            Go to Bulk Edit
          </Link>
        </Button>
      </div>

      <BulkUploadForm />
    </div>
  )
}
