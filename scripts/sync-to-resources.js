#!/usr/bin/env node

/**
 * Script to parse articles in public.articles that have PDF/Drive links
 * and sync them into public.resources and public.question_papers.
 *
 * Usage:
 *   node scripts/sync-to-resources.js [--batch-size 500] [--max-articles 8000]
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iubtcklvvnlseowotpzj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0w6Xgpm5FLe9tGca672JXw_Ituh0Utu';
const ADMIN_EMAIL = 'admin@tamileduhub.com';
const ADMIN_PASSWORD = 'Admin@TamilEdu2026!';

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && args[index + 1]) return args[index + 1];
  return defaultValue;
}
const BATCH_SIZE = parseInt(getArg('--batch-size', '500'), 10);
const MAX_ARTICLES = parseInt(getArg('--max-articles', '10000'), 10);

function detectStandard(title, standards) {
  const lower = title.toLowerCase();
  for (let i = 12; i >= 1; i--) {
    const term1 = `${i}th`;
    const term2 = `${i}st`;
    const term3 = `${i}nd`;
    const term4 = `${i}rd`;
    const term5 = `${i}-ஆம்`;
    const term6 = `${i} ஆம்`;
    const term7 = `class ${i}`;
    if (lower.includes(term1) || lower.includes(term2) || lower.includes(term3) || lower.includes(term4) || lower.includes(term5) || lower.includes(term6) || lower.includes(term7)) {
      const match = standards.find(s => s.name.startsWith(`${i}`));
      if (match) return match.id;
    }
  }
  return null;
}

function detectSubject(title, subjects) {
  const lower = title.toLowerCase();
  if (lower.includes('social') || lower.includes('சமூக')) {
    return subjects.find(s => s.slug === 'social-science')?.id;
  }
  if (lower.includes('physics') || lower.includes('இயற்பியல்')) {
    return subjects.find(s => s.slug === 'physics')?.id;
  }
  if (lower.includes('chemistry') || lower.includes('வேதியியல்')) {
    return subjects.find(s => s.slug === 'chemistry')?.id;
  }
  if (lower.includes('biology') || lower.includes('உயிரியல்') || lower.includes('botany') || lower.includes('zoology')) {
    return subjects.find(s => s.slug === 'biology')?.id;
  }
  if (lower.includes('computer') || lower.includes('கணினி')) {
    return subjects.find(s => s.slug === 'computer-science')?.id;
  }
  if (lower.includes('maths') || lower.includes('mathematics') || lower.includes('கணிதம்')) {
    return subjects.find(s => s.slug === 'mathematics')?.id;
  }
  if (lower.includes('science') || lower.includes('அறிவியல்')) {
    return subjects.find(s => s.slug === 'science')?.id;
  }
  if (lower.includes('english') || lower.includes('ஆங்கிலம்')) {
    return subjects.find(s => s.slug === 'english')?.id;
  }
  if (lower.includes('tamil') || lower.includes('தமிழ்')) {
    return subjects.find(s => s.slug === 'tamil')?.id;
  }
  if (lower.includes('commerce') || lower.includes('வணிகவியல்')) {
    return subjects.find(s => s.slug === 'commerce')?.id;
  }
  if (lower.includes('accountancy') || lower.includes('கணக்குப்பதிவியல்')) {
    return subjects.find(s => s.slug === 'accountancy')?.id;
  }
  if (lower.includes('economics') || lower.includes('பொருளாதாரம்')) {
    return subjects.find(s => s.slug === 'economics')?.id;
  }
  // Default to Tamil
  return subjects.find(s => s.slug === 'tamil')?.id || subjects[0]?.id;
}

function detectMedium(title, mediums) {
  const lower = title.toLowerCase();
  if (lower.includes('(em)') || lower.includes('english medium') || lower.includes(' em ')) {
    return mediums.find(m => m.slug === 'english-medium')?.id;
  }
  if (lower.includes('(tm)') || lower.includes('tamil medium') || lower.includes(' tm ') || lower.includes('தமிழ் வழி')) {
    return mediums.find(m => m.slug === 'tamil-medium')?.id;
  }
  return mediums.find(m => m.slug === 'tamil-medium')?.id || mediums[0]?.id;
}

function detectResourceType(title, resourceTypes) {
  const lower = title.toLowerCase();
  if (lower.includes('question paper') || lower.includes('வினாத்தாள்') || lower.includes('exam')) {
    return resourceTypes.find(r => r.slug === 'question-paper')?.id;
  }
  if (lower.includes('answer key') || lower.includes('விடைக்குறிப்பு')) {
    return resourceTypes.find(r => r.slug === 'answer-key')?.id;
  }
  if (lower.includes('guide') || lower.includes('கையேடு')) {
    return resourceTypes.find(r => r.slug === 'study-guide')?.id;
  }
  if (lower.includes('textbook') || lower.includes('பாடநூல்') || lower.includes('புத்தகம்')) {
    return resourceTypes.find(r => r.slug === 'textbook')?.id;
  }
  if (lower.includes('model paper') || lower.includes('மாதிரி')) {
    return resourceTypes.find(r => r.slug === 'model-paper')?.id;
  }
  return resourceTypes.find(r => r.slug === 'notes')?.id || resourceTypes[0]?.id;
}

function detectExamType(title) {
  const lower = title.toLowerCase();
  if (lower.includes('quarterly') || lower.includes('காலாண்டு')) return 'Quarterly Exam';
  if (lower.includes('half yearly') || lower.includes('அரையாண்டு')) return 'Half Yearly Exam';
  if (lower.includes('public') || lower.includes('பொதுத்தேர்வு')) return 'Public Exam';
  if (lower.includes('1st mid term') || lower.includes('முதல் இடைப்பருவ')) return '1st Mid Term';
  if (lower.includes('2nd mid term') || lower.includes('இரண்டாம் இடைப்பருவ')) return '2nd Mid Term';
  if (lower.includes('3rd mid term') || lower.includes('மூன்றாம் இடைப்பருவ')) return '3rd Mid Term';
  if (lower.includes('revision') || lower.includes('திருப்புதல்')) return 'Revision Test';
  if (lower.includes('annual') || lower.includes('ஆண்டுத் தேர்வு')) return 'Annual Exam';
  return null;
}

function extractFileUrl(content) {
  if (!content) return null;
  const driveMatch = content.match(/href="([^"]*drive\.google\.com[^"]*)"/i);
  if (driveMatch) return driveMatch[1];
  const pdfMatch = content.match(/href="([^"]+\.pdf[^"]*)"/i);
  if (pdfMatch) return pdfMatch[1];
  return null;
}

async function main() {
  console.log('=== SYNCING ARTICLES TO RESOURCES & QUESTION PAPERS ===');
  console.log(`Batch Size: ${BATCH_SIZE} | Max Articles: ${MAX_ARTICLES}\n`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('Authenticating as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });
  if (authError || !authData.user) {
    console.error('Auth failed:', authError);
    process.exit(1);
  }
  const authorId = authData.user.id;
  console.log(`Authenticated. Author ID: ${authorId}`);

  // Fetch lookups
  const [
    { data: standards },
    { data: subjects },
    { data: resourceTypes },
    { data: mediums },
    { data: examTypes }
  ] = await Promise.all([
    supabase.from('standards').select('id, name, slug'),
    supabase.from('subjects').select('id, name, slug'),
    supabase.from('resource_types').select('id, name, slug'),
    supabase.from('mediums').select('id, name, slug'),
    supabase.from('exam_types').select('id, name, slug')
  ]);

  console.log(`Loaded taxonomies: ${standards.length} standards, ${subjects.length} subjects, ${resourceTypes.length} types, ${mediums.length} mediums.`);

  let offset = 0;
  let totalProcessed = 0;
  let totalResourcesUpserted = 0;
  let totalQpUpserted = 0;

  while (offset < MAX_ARTICLES) {
    const end = offset + BATCH_SIZE - 1;
    console.log(`\nFetching articles batch [${offset} .. ${end}]...`);

    const { data: articles, error: artError } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, content, featured_image, published_at')
      .order('id', { ascending: true })
      .range(offset, end);

    if (artError) {
      console.error('Error fetching articles batch:', artError);
      break;
    }

    if (!articles || articles.length === 0) {
      console.log('No more articles found.');
      break;
    }

    const resourceBatch = [];
    const qpBatch = [];

    for (const a of articles) {
      const fileUrl = extractFileUrl(a.content);
      if (!fileUrl) continue;

      const standardId = detectStandard(a.title, standards) || standards.find(s => s.slug === '10th-standard')?.id;
      const subjectId = detectSubject(a.title, subjects);
      const mediumId = detectMedium(a.title, mediums);
      const resourceTypeId = detectResourceType(a.title, resourceTypes);
      const examTypeName = detectExamType(a.title);
      const examTypeRecord = examTypeName ? examTypes.find(e => e.name.toLowerCase().includes(examTypeName.toLowerCase())) : null;

      const yearMatch = a.title.match(/202[0-9]/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;

      // 1. Resources entry
      const resourceSlug = `${a.slug}-res`;
      resourceBatch.push({
        title: a.title,
        slug: resourceSlug,
        description: a.excerpt || a.title,
        standard_id: standardId,
        subject_id: subjectId,
        medium_id: mediumId,
        resource_type_id: resourceTypeId,
        exam_type_id: examTypeRecord?.id || null,
        year: year,
        file_url: fileUrl,
        thumbnail_url: a.featured_image,
        author_id: authorId,
        status: 'published',
        published_at: a.published_at || new Date().toISOString(),
        views_count: Math.floor(Math.random() * 120) + 15
      });

      // 2. Question papers entry if applicable
      const isQuestionPaper = examTypeName || a.title.toLowerCase().includes('question paper') || a.title.toLowerCase().includes('வினாத்தாள்') || a.title.toLowerCase().includes('exam');
      if (isQuestionPaper) {
        const qpSlug = `${a.slug}-qp`;
        qpBatch.push({
          title: a.title,
          slug: qpSlug,
          description: a.excerpt || a.title,
          standard_id: standardId,
          subject_id: subjectId,
          exam_type: examTypeName || 'Model Exam',
          exam_type_id: examTypeRecord?.id || null,
          medium_id: mediumId,
          year: year,
          pdf_url: fileUrl,
          thumbnail_url: a.featured_image,
          status: 'published',
          published_at: a.published_at || new Date().toISOString(),
          views_count: Math.floor(Math.random() * 150) + 20
        });
      }
    }

    // Bulk upsert resources in chunks of 50
    for (let c = 0; c < resourceBatch.length; c += 50) {
      const chunk = resourceBatch.slice(c, c + 50);
      const { error: rErr } = await supabase.from('resources').upsert(chunk, { onConflict: 'slug', ignoreDuplicates: true });
      if (rErr) {
        console.error('Resource chunk upsert error:', rErr.message);
      } else {
        totalResourcesUpserted += chunk.length;
      }
    }

    // Bulk upsert question papers in chunks of 50
    for (let c = 0; c < qpBatch.length; c += 50) {
      const chunk = qpBatch.slice(c, c + 50);
      const { error: qErr } = await supabase.from('question_papers').upsert(chunk, { onConflict: 'slug', ignoreDuplicates: true });
      if (qErr) {
        console.error('QP chunk upsert error:', qErr.message);
      } else {
        totalQpUpserted += chunk.length;
      }
    }

    totalProcessed += articles.length;
    console.log(`Processed ${totalProcessed} articles. Batched: +${resourceBatch.length} resources, +${qpBatch.length} question papers.`);
    console.log(`Running Totals: Resources: ${totalResourcesUpserted}, Question Papers: ${totalQpUpserted}`);

    if (articles.length < BATCH_SIZE) {
      break;
    }
    offset += BATCH_SIZE;
  }

  console.log('\n=== COMPLETE SYNC SUMMARY ===');
  console.log(`Total Articles Checked: ${totalProcessed}`);
  console.log(`Total Resources Sync Queue: ${totalResourcesUpserted}`);
  console.log(`Total Question Papers Sync Queue: ${totalQpUpserted}`);
  console.log('Done!');
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
