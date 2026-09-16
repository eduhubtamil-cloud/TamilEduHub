const https = require('https');

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YnRja2x2dm5sc2Vvd290cHpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUzNTYxMiwiZXhwIjoyMTA1MTExNjEyfQ.MT1FGEoYC7UdYNGP130k1KQxc0VA3ngGB6rz7RClKbk';

const sendRequest = (table, data) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: '104.18.38.10',
      port: 443,
      path: `/rest/v1/${table}?on_conflict=slug`,
      method: 'POST',
      headers: {
        'Host': 'iubtcklvvnlseowotpzj.supabase.co',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation',
        'Content-Length': Buffer.byteLength(payload)
      },
      servername: 'iubtcklvvnlseowotpzj.supabase.co', // Critical for Cloudflare SNI
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`Status ${res.statusCode}: ${body}`));
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

async function runSeed() {
  const insertData = async (table, data) => {
    console.log(`Seeding ${table}...`);
    try {
      await sendRequest(table, data);
    } catch(err) {
      console.error(`❌ Error seeding ${table}:`, err.message);
    }
  };

  const standards = [
    { name: '12th Standard', slug: '12th-standard', display_order: 1, seo_title: '12th Standard Study Materials & Guides', seo_description: 'Download 12th standard PDF resources.' },
    { name: '11th Standard', slug: '11th-standard', display_order: 2, seo_title: '11th Standard Study Materials & Guides', seo_description: 'Download 11th standard PDF resources.' },
    { name: '10th Standard', slug: '10th-standard', display_order: 3, seo_title: '10th Standard Study Materials & Guides', seo_description: 'Download 10th standard PDF resources.' },
    { name: '9th Standard', slug: '9th-standard', display_order: 4, seo_title: '9th Standard Study Materials & Guides', seo_description: 'Download 9th standard PDF resources.' },
    { name: '8th Standard', slug: '8th-standard', display_order: 5, seo_title: '8th Standard Study Materials & Guides', seo_description: 'Download 8th standard PDF resources.' },
    { name: '7th Standard', slug: '7th-standard', display_order: 6, seo_title: '7th Standard Study Materials & Guides', seo_description: 'Download 7th standard PDF resources.' },
    { name: '6th Standard', slug: '6th-standard', display_order: 7, seo_title: '6th Standard Study Materials & Guides', seo_description: 'Download 6th standard PDF resources.' },
    { name: '5th Standard', slug: '5th-standard', display_order: 8, seo_title: '5th Standard Study Materials & Guides', seo_description: 'Download 5th standard PDF resources.' },
    { name: '4th Standard', slug: '4th-standard', display_order: 9, seo_title: '4th Standard Study Materials & Guides', seo_description: 'Download 4th standard PDF resources.' },
    { name: '3rd Standard', slug: '3rd-standard', display_order: 10, seo_title: '3rd Standard Study Materials & Guides', seo_description: 'Download 3rd standard PDF resources.' },
    { name: '2nd Standard', slug: '2nd-standard', display_order: 11, seo_title: '2nd Standard Study Materials & Guides', seo_description: 'Download 2nd standard PDF resources.' },
    { name: '1st Standard', slug: '1st-standard', display_order: 12, seo_title: '1st Standard Study Materials & Guides', seo_description: 'Download 1st standard PDF resources.' }
  ];
  await insertData('standards', standards);

  const subjects = [
    { name: 'Tamil', slug: 'tamil', display_order: 1 },
    { name: 'English', slug: 'english', display_order: 2 },
    { name: 'Mathematics', slug: 'mathematics', display_order: 3 },
    { name: 'Science', slug: 'science', display_order: 4 },
    { name: 'Social Science', slug: 'social-science', display_order: 5 },
    { name: 'Physics', slug: 'physics', display_order: 6 },
    { name: 'Chemistry', slug: 'chemistry', display_order: 7 },
    { name: 'Biology', slug: 'biology', display_order: 8 },
    { name: 'Computer Science', slug: 'computer-science', display_order: 9 },
    { name: 'Accountancy', slug: 'accountancy', display_order: 10 },
    { name: 'Commerce', slug: 'commerce', display_order: 11 },
    { name: 'Economics', slug: 'economics', display_order: 12 }
  ];
  await insertData('subjects', subjects);

  const mediums = [
    { name: 'Tamil Medium', slug: 'tamil-medium' },
    { name: 'English Medium', slug: 'english-medium' },
    { name: 'Bilingual', slug: 'bilingual' }
  ];
  await insertData('mediums', mediums);

  const resourceTypes = [
    { name: 'Study Guide', slug: 'study-guide' },
    { name: 'Question Paper', slug: 'question-paper' },
    { name: 'Textbook', slug: 'textbook' },
    { name: 'Answer Key', slug: 'answer-key' },
    { name: 'Notes', slug: 'notes' },
    { name: 'Worksheet', slug: 'worksheet' },
    { name: 'Model Paper', slug: 'model-paper' },
    { name: 'Revision Material', slug: 'revision-material' }
  ];
  await insertData('resource_types', resourceTypes);

  const categories = [
    { name: 'Educational Articles', slug: 'educational-articles' },
    { name: 'Exam Tips', slug: 'exam-tips' },
    { name: 'Announcements', slug: 'announcements' },
    { name: 'Study Guides', slug: 'study-guides' }
  ];
  await insertData('categories', categories);
  
  console.log("✅ Seed process finished!");
}

runSeed();
