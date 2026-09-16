import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createArticle } from '@/app/admin/articles/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export const metadata = {
  title: 'Write Article - TamilEduHub CMS',
}

export default async function CreateArticlePage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('id, name')
  const displayCategories = (categories || []) as any[]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Write New Article</h1>
          <p className="text-slate-500">Publish news, announcements, and study tips.</p>
        </div>
      </div>

      <form action={createArticle}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input id="title" name="title" placeholder="e.g. How to prepare for 12th Board Exams" required className="text-lg font-medium" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Short Excerpt (Summary)</Label>
                  <textarea 
                    id="excerpt" 
                    name="excerpt" 
                    rows={3}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="A brief summary that appears on the blog listing page..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Content *</Label>
                  <textarea 
                    id="content" 
                    name="content" 
                    rows={15}
                    required
                    className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    placeholder="Write your article content here... (HTML or Markdown supported if configured)"
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Config Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <select id="category_id" name="category_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Select Category...</option>
                    {displayCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Upload Image</span></p>
                        <p className="text-xs text-slate-400">PNG, JPG (Max 5MB)</p>
                      </div>
                      <input id="image" name="image" type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t border-slate-200 p-6">
                <Button type="submit" className="w-full gap-2">
                  <Save className="h-4 w-4" /> Publish Article
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/admin/articles">Cancel</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </form>
    </div>
  )
}
