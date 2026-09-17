# Production Deployment Checklist - TamilEduHub

Follow these steps precisely to deploy TamilEduHub to your production environment (e.g., Vercel).

## 1. Environment Variables & Supabase Configuration
- [ ] Set NEXT_PUBLIC_SUPABASE_URL in your hosting provider.
- [ ] Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting provider.
- [ ] Set NEXT_PUBLIC_SITE_URL (e.g., https://tamileduhub.com) for SEO, sitemaps, and canonical generation.
- [ ] Verify Supabase API settings are enabled and restricting anon access where necessary.

## 2. Database & RLS
- [ ] Ensure all migration scripts up to 20260916000006_productization_phase7_performance.sql have been executed in your Supabase SQL Editor.
- [ ] Verify Row Level Security (RLS) is explicitly enabled on esources, standards, subjects, and collections.
- [ ] Confirm the is_admin PL/pgSQL function is active and protecting CMS mutating operations.
- [ ] Create at least one user account in Supabase Auth, then manually insert a row in the oles table assigning that user's UUID the Super Admin role.

## 3. Storage & PDFs
- [ ] Verify the esources storage bucket exists in Supabase.
- [ ] Verify the bucket is strictly configured to accept only .pdf (and optionally image thumbnails) formats.
- [ ] Confirm RLS is active on the esources bucket (Anon = SELECT only, Admin = INSERT/UPDATE/DELETE).

## 4. Domain & Network Security
- [ ] Attach your custom domain (	amileduhub.com) to your hosting provider.
- [ ] Verify SSL certificates are active and forcing HTTPS.
- [ ] Configure www to non-www redirects (or vice-versa) at the DNS level to prevent duplicate SEO rendering.

## 5. SEO & Search Console
- [ ] Verify https://tamileduhub.com/sitemap.xml generates successfully and lists dynamic resources.
- [ ] Verify https://tamileduhub.com/robots.txt generates successfully and points to the sitemap.
- [ ] Submit the XML Sitemap to Google Search Console.
- [ ] Use Search Console's "URL Inspection" tool on the homepage to verify Google can parse the JSON-LD structured data.

## 6. Community Acquisition & Analytics
- [ ] Configure the correct active WhatsApp invite link in the Supabase community_links table (or Admin Dashboard).
- [ ] Configure the Telegram invite link in the community_links table.
- [ ] Configure the Google Play URL in the community_links table (if applicable).
- [ ] Monitor the community_clicks_analytics table after launch to ensure utm_source, utm_medium, and device_category are capturing correctly.

## 7. Backups & Recovery
- [ ] Enable Point-in-Time Recovery (PITR) in Supabase if your plan allows.
- [ ] Enable daily automated database backups in Supabase settings.

## 8. Final Production Smoke Test
- [ ] Open a fresh Incognito window.
- [ ] Verify the Homepage loads quickly without errors.
- [ ] Click through a taxonomy (e.g., /6th-standard/tamil) and ensure resources render.
- [ ] Open a Resource page and click the Download button to verify the PDF serves correctly.
- [ ] Log in using the Admin account and verify access to /admin/dashboard.
- [ ] Ensure the Search bar returns results instantly (verifying Trigram indexes).
