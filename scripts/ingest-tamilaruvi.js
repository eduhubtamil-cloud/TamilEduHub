#!/usr/bin/env node

/**
 * Ingestion script to migrate and load posts from https://www.tamilaruvi.in/
 * into TamilEduHub Supabase database.
 *
 * Usage:
 *   node scripts/ingest-tamilaruvi.js [--limit 50] [--start 1] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iubtcklvvnlseowotpzj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0w6Xgpm5FLe9tGca672JXw_Ituh0Utu';
const ADMIN_EMAIL = 'admin@tamileduhub.com';
const ADMIN_PASSWORD = 'Admin@TamilEdu2026!';
const STATE_FILE = path.join(__dirname, '..', '.tamilaruvi-state.json');

// Parse CLI arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  return defaultValue;
}
const isDryRun = args.includes('--dry-run');
const limit = parseInt(getArg('--limit', '50'), 10);
const startIndexArg = parseInt(getArg('--start', '0'), 10);

// Load previous state if available
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      console.warn('Could not parse state file, starting fresh.');
    }
  }
  return { nextIndex: 1, totalProcessed: 0, importedSlugs: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// Clean and sanitize Blogger HTML content
function sanitizeHtml(rawHtml) {
  if (!rawHtml) return '';

  let cleaned = rawHtml;

  // 1. Remove all script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Remove Google AdSense tags
  cleaned = cleaned.replace(/<ins\s+class="adsbygoogle"[^>]*>[\s\S]*?<\/ins>/gi, '');

  // 3. Remove style tags
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 4. Remove empty iframes
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // 5. Clean up inline fixed widths that break responsive layouts
  cleaned = cleaned.replace(/width="[6-9]\d{2,}"/gi, 'width="100%"');
  cleaned = cleaned.replace(/height="[6-9]\d{2,}"/gi, 'height="auto"');
  cleaned = cleaned.replace(/style="[^"]*width:\s*[6-9]\d{2,}px[^"]*"/gi, 'style="width: 100%; max-width: 100%;"');

  // 6. Ensure links open in a new tab safely
  cleaned = cleaned.replace(/<a\s+(?!.*?target=)([^>]+)>/gi, '<a target="_blank" rel="noopener noreferrer" $1>');

  // 7. Remove excessive consecutive blank lines
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />');
  cleaned = cleaned.replace(/(<div>\s*<br\s*\/?>\s*<\/div>\s*){3,}/gi, '<div><br /></div>');

  return cleaned.trim();
}

// Extract plain text excerpt from HTML
function createExcerpt(html, maxLength = 220) {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Extract high-resolution image
function extractFeaturedImage(entry, html) {
  // Try media$thumbnail first
  if (entry['media$thumbnail'] && entry['media$thumbnail'].url) {
    const rawUrl = entry['media$thumbnail'].url;
    // Blogger thumbnail upscaling: replace /s72-c or similar with /s1600
    return rawUrl.replace(/\/s\d+(-c)?|\/w\d+-h\d+(-[a-z]+)*|\/s72-w\d+-h\d+-c/g, '/s1600');
  }

  // Fallback to first img src in html
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return null;
}

// Derive clean URL slug
function extractSlug(entry) {
  const alternateLink = (entry.link || []).find(l => l.rel === 'alternate');
  if (alternateLink && alternateLink.href) {
    const urlParts = alternateLink.href.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    return lastPart.replace(/\.html$/i, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  }
  // Fallback to title-based slug
  return entry.title['$t'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// Determine best matching category ID
function matchCategory(title, tags, categoriesMap) {
  const combined = (title + ' ' + tags.join(' ')).toLowerCase();

  if (combined.includes('answer key') || combined.includes('விடைக்குறிப்பு') || combined.includes('answer-key')) {
    return categoriesMap['answer-keys'] || categoriesMap['question-papers'];
  }
  if (combined.includes('question paper') || combined.includes('வினாத்தாள்') || combined.includes('model question') || combined.includes('original question')) {
    return categoriesMap['question-papers'];
  }
  if (combined.includes('study material') || combined.includes('guide') || combined.includes('notes') || combined.includes('கையேடு')) {
    return categoriesMap['study-guides'] || categoriesMap['school-education'];
  }
  if (combined.includes('announcement') || combined.includes('news') || combined.includes('time table') || combined.includes('timetable') || combined.includes('date sheet')) {
    return categoriesMap['syllabus-timetable'] || categoriesMap['announcements'];
  }
  if (combined.includes('tips') || combined.includes('how to prepare')) {
    return categoriesMap['exam-tips'];
  }

  return categoriesMap['school-education'] || categoriesMap['educational-articles'];
}

async function main() {
  console.log('=== TAMILARUVI.IN INGESTION PIPELINE ===');
  console.log(`Target Limit: ${limit} posts | Dry-run: ${isDryRun}`);

  const state = loadState();
  const startIndex = startIndexArg > 0 ? startIndexArg : state.nextIndex;
  console.log(`Starting from index: ${startIndex}\n`);

  // Initialize Supabase Client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let authorId = null;
  const categoriesMap = {};

  if (!isDryRun) {
    console.log(`Authenticating as admin (${ADMIN_EMAIL})...`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (authError || !authData.user) {
      console.error('Authentication failed:', authError);
      process.exit(1);
    }
    authorId = authData.user.id;
    console.log(`Authenticated successfully. Author ID: ${authorId}`);

    // Fetch category map
    const { data: catData, error: catError } = await supabase.from('categories').select('id, slug');
    if (catError) {
      console.error('Error fetching categories:', catError);
      process.exit(1);
    }
    (catData || []).forEach(c => {
      categoriesMap[c.slug] = c.id;
    });
    console.log(`Loaded ${Object.keys(categoriesMap).length} taxonomy categories.`);
  }

  const batchSize = Math.min(limit, 50);
  let currentStart = startIndex;
  let processedInSession = 0;
  let importedInSession = 0;

  while (processedInSession < limit) {
    const fetchCount = Math.min(batchSize, limit - processedInSession);
    const feedUrl = `https://www.tamilaruvi.in/feeds/posts/default?alt=json&start-index=${currentStart}&max-results=${fetchCount}`;

    console.log(`\nFetching batch: start-index=${currentStart}, max-results=${fetchCount}...`);
    let feedData;
    try {
      const res = await fetch(feedUrl);
      if (!res.ok) {
        console.error(`Feed returned HTTP ${res.status}: ${res.statusText}`);
        break;
      }
      feedData = await res.json();
    } catch (err) {
      console.error('Network error fetching Blogger feed:', err);
      break;
    }

    const entries = feedData.feed?.entry || [];
    if (entries.length === 0) {
      console.log('No more posts found in feed. Completed!');
      break;
    }

    console.log(`Received ${entries.length} posts from feed.`);

    for (const entry of entries) {
      const title = (entry.title?.['$t'] || '').trim();
      const slug = extractSlug(entry);
      const rawContent = entry.content?.['$t'] || '';
      const content = sanitizeHtml(rawContent);
      const excerpt = createExcerpt(content);
      const featuredImage = extractFeaturedImage(entry, rawContent);
      const publishedAt = entry.published?.['$t'] || new Date().toISOString();
      const tags = (entry.category || []).map(c => c.term);
      const categoryId = matchCategory(title, tags, categoriesMap);

      // Count attached download links
      const driveMatches = rawContent.match(/href="([^"]*drive\.google\.com[^"]*)"/gi) || [];
      const pdfMatches = rawContent.match(/href="([^"]+\.pdf[^"]*)"/gi) || [];
      const totalLinks = driveMatches.length + pdfMatches.length;

      console.log(`-> [${currentStart + processedInSession}] "${title.substring(0, 60)}..." (Slug: ${slug.substring(0, 35)}... | Links: ${totalLinks})`);

      if (!isDryRun) {
        const articlePayload = {
          title,
          slug,
          excerpt,
          content,
          featured_image: featuredImage,
          category_id: categoryId,
          author_id: authorId,
          status: 'published',
          published_at: publishedAt,
          seo_title: `${title} | TamilEduHub`,
          seo_description: excerpt,
          canonical_url: `https://tamil-edu-hub.vercel.app/articles/${slug}`
        };

        // Check if article with this slug exists
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              title: articlePayload.title,
              excerpt: articlePayload.excerpt,
              content: articlePayload.content,
              featured_image: articlePayload.featured_image,
              category_id: articlePayload.category_id,
              published_at: articlePayload.published_at,
              seo_title: articlePayload.seo_title,
              seo_description: articlePayload.seo_description,
              canonical_url: articlePayload.canonical_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error(`   Error updating "${slug}":`, updateError.message);
          } else {
            console.log(`   Updated existing article ID: ${existing.id}`);
            importedInSession++;
          }
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from('articles')
            .insert([articlePayload])
            .select('id')
            .single();

          if (insertError) {
            console.error(`   Error inserting "${slug}":`, insertError.message);
          } else {
            console.log(`   Created new article ID: ${inserted.id}`);
            importedInSession++;
          }
        }

        if (!state.importedSlugs.includes(slug)) {
          state.importedSlugs.push(slug);
        }
      }

      processedInSession++;
      if (processedInSession >= limit) break;
    }

    currentStart += entries.length;
    state.nextIndex = currentStart;
    state.totalProcessed += processedInSession;
    if (!isDryRun) {
      saveState(state);
    }
  }

  console.log('\n=== INGESTION SUMMARY ===');
  console.log(`Total processed this run: ${processedInSession}`);
  console.log(`Total imported/updated: ${importedInSession}`);
  console.log(`Next start index saved: ${state.nextIndex}`);
  console.log('Done!');
}

main().catch(err => {
  console.error('Fatal pipeline error:', err);
  process.exit(1);
});
