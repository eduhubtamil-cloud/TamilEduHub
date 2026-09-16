const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  const password = encodeURIComponent('Sura@1620!@');
  const projectId = 'iubtcklvvnlseowotpzj';
  
  // Supabase uses pooler URLs for IPv4 now. We will try common regions based on your timezone.
  const regions = [
    'ap-south-1', // Mumbai (Most likely)
    'ap-southeast-1', // Singapore
    'us-east-1', // N. Virginia (Default)
    'eu-central-1', // Frankfurt
  ];

  let connectedClient = null;

  for (const region of regions) {
    const connectionString = `postgresql://postgres.${projectId}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`Trying region: ${region}...`);
    
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      // Set a short timeout for the connection attempt
      await Promise.race([
        client.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      console.log(`\n✅ Connected successfully to ${region}!`);
      connectedClient = client;
      break; // Exit loop if successful
    } catch (err) {
      console.log(`❌ Failed connecting to ${region}.`);
      await client.end().catch(() => {});
    }
  }

  if (!connectedClient) {
    console.error("\nCould not establish a connection using the Supavisor pooler.");
    return;
  }

  try {
    const sqlPath = path.join(__dirname, 'supabase', 'seed', 'initial_data.sql');
    const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

    console.log("Running seed script to insert Standards and Subjects...");
    await connectedClient.query(sqlQuery);
    console.log("✅ Seed script executed successfully!");

  } catch (err) {
    console.error("Error executing seed script:", err.message);
  } finally {
    await connectedClient.end();
  }
}

runSeed();
