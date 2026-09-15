const PROJECT_ID = '6a9d93e80009b82fad0f';
const API_KEY = 'standard_c5216dd797850f4fa228468f3acd5897c232f3fbffc32700642a5037ddb231f5e57e86902c17badb92850e1ac7c800c8771b81ae7ff64f9b34474a0a1a2d2dc07827346819f6c01473303c0a07ae41b7207e9d04895fc63f3fe11d3f2e811176115895023092a08fd02c8e4e4aea4f5cae902b9a04e55a299c76264de8fab195';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';

async function fetchAppwrite(path) {
    const res = await fetch(`${ENDPOINT}${path}`, {
        method: 'GET',
        headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        console.error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.error(text);
        return null;
    }
    return res.json();
}

async function check() {
    console.log("Checking Appwrite Project State...");
    
    // 1. Check Databases
    const dbs = await fetchAppwrite('/databases');
    if (dbs) {
        console.log(`\n--- DATABASES (${dbs.total}) ---`);
        for (const db of dbs.databases) {
            console.log(`- Database: ${db.name} (ID: ${db.$id})`);
            const collections = await fetchAppwrite(`/databases/${db.$id}/collections`);
            if (collections) {
                for (const col of collections.collections) {
                    console.log(`  └─ Collection: ${col.name} (ID: ${col.$id})`);
                }
            }
        }
    }

    // 2. Check Storage Buckets
    const buckets = await fetchAppwrite('/storage/buckets');
    if (buckets) {
        console.log(`\n--- STORAGE BUCKETS (${buckets.total}) ---`);
        for (const b of buckets.buckets) {
            console.log(`- Bucket: ${b.name} (ID: ${b.$id})`);
        }
    }

    // 3. Check Users
    const users = await fetchAppwrite('/users');
    if (users) {
        console.log(`\n--- USERS (${users.total}) ---`);
        for (const u of users.users.slice(0, 5)) { // limit to first 5
            console.log(`- User: ${u.name} (Email: ${u.email})`);
        }
        if (users.total > 5) console.log(`  ... and ${users.total - 5} more users.`);
    }
}

check().catch(console.error);
