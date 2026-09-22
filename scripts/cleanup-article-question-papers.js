#!/usr/bin/env node

/**
 * Script to clean up Question Papers & Answer Keys from public.articles table,
 * since they are already stored in public.question_papers and public.resources.
 *
 * Usage:
 *   node scripts/cleanup-article-question-papers.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iubtcklvvnlseowotpzj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0w6Xgpm5FLe9tGca672JXw_Ituh0Utu';
const ADMIN_EMAIL = 'admin@tamileduhub.com';
const ADMIN_PASSWORD = 'Admin@TamilEdu2026!';

const QP_CAT_ID = '9ceeee26-a5bb-442e-bf08-3fd1c4752f23'; // Question Papers
const AK_CAT_ID = '152f8e7c-7195-4d65-9aa9-6324e378b43c'; // Answer Keys

async function main() {
  console.log('=== CLEANING UP QUESTION PAPERS FROM ARTICLES ===\n');

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
  console.log('Authenticated successfully.\n');

  let totalDeleted = 0;
  const targetCategoryIds = [QP_CAT_ID, AK_CAT_ID];

  for (const catId of targetCategoryIds) {
    const catName = catId === QP_CAT_ID ? 'Question Papers' : 'Answer Keys';
    console.log(`Starting cleanup for category: ${catName}...`);

    while (true) {
      const { data: articles, error: fetchErr } = await supabase
        .from('articles')
        .select('id')
        .eq('category_id', catId)
        .limit(200);

      if (fetchErr) {
        console.error(`Error fetching articles for ${catName}:`, fetchErr.message);
        break;
      }

      if (!articles || articles.length === 0) {
        console.log(`Finished cleanup for ${catName}.\n`);
        break;
      }

      const ids = articles.map(a => a.id);
      const { error: delErr } = await supabase
        .from('articles')
        .delete()
        .in('id', ids);

      if (delErr) {
        console.error(`Error deleting batch:`, delErr.message);
        break;
      }

      totalDeleted += ids.length;
      console.log(`Deleted ${ids.length} items (Total deleted so far: ${totalDeleted})`);
    }
  }

  // Summary counts
  const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  const { count: qpCount } = await supabase.from('question_papers').select('*', { count: 'exact', head: true });
  const { count: resCount } = await supabase.from('resources').select('*', { count: 'exact', head: true });

  console.log('\n=== FINAL DATABASE SUMMARY ===');
  console.log(`Total Question Papers / Answer Keys removed from Articles: ${totalDeleted}`);
  console.log(`Remaining Articles in CMS (News, Guides, Syllabus, School Education): ${artCount}`);
  console.log(`Dedicated Question Papers in CMS: ${qpCount}`);
  console.log(`Dedicated Resources in CMS: ${resCount}`);
  console.log('Cleanup completed successfully!');
}

main().catch(err => {
  console.error('Fatal cleanup error:', err);
  process.exit(1);
});
