const https = require('https');

const SUPABASE_URL = 'https://104.18.38.10/rest/v1/resources?select=*';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YnRja2x2dm5sc2Vvd290cHpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUzNTYxMiwiZXhwIjoyMTA1MTExNjEyfQ.MT1FGEoYC7UdYNGP130k1KQxc0VA3ngGB6rz7RClKbk';

const req = https.request(SUPABASE_URL, {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Host': 'iubtcklvvnlseowotpzj.supabase.co'
  },
  servername: 'iubtcklvvnlseowotpzj.supabase.co'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2)));
});

req.on('error', console.error);
req.end();
