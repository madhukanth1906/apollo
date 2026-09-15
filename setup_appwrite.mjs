import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = '6a9d93e80009b82fad0f';
const API_KEY = 'standard_c5216dd797850f4fa228468f3acd5897c232f3fbffc32700642a5037ddb231f5e57e86902c17badb92850e1ac7c800c8771b81ae7ff64f9b34474a0a1a2d2dc07827346819f6c01473303c0a07ae41b7207e9d04895fc63f3fe11d3f2e811176115895023092a08fd02c8e4e4aea4f5cae902b9a04e55a299c76264de8fab195';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = 'pakshya-db';
const COL_INSPECTIONS = 'inspections';
const COL_PRODUCTS = 'products';
const BUCKET_IMAGES = 'inspection-images';
const BUCKET_REPORTS = 'reports-bucket';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function setup() {
    console.log("🚀 Starting Appwrite Infrastructure Setup...");

    // 1. Create Database
    try {
        console.log(`\nCreating Database: ${DB_ID}`);
        await databases.create(DB_ID, 'PakshyaDB');
        console.log("✅ Database created successfully.");
    } catch (e) {
        if (e.code === 409) console.log("⏭️ Database already exists. Skipping...");
        else throw e;
    }

    // 2. Create Inspections Collection
    try {
        console.log(`\nCreating Collection: ${COL_INSPECTIONS}`);
        await databases.createCollection(DB_ID, COL_INSPECTIONS, 'Inspections', [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
        ]);
        console.log("✅ Collection 'Inspections' created successfully.");
        
        // Add Attributes
        console.log("Adding attributes to 'Inspections'...");
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'date', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'timestamp', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'inspectorId', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'productName', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'brand', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'sku', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'category', 255, false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'overallStatus', 50, false);
        await databases.createIntegerAttribute(DB_ID, COL_INSPECTIONS, 'overallScore', false);
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'declarations', 1000000, false); // Long string for JSON array
        await databases.createStringAttribute(DB_ID, COL_INSPECTIONS, 'inspectorRemarks', 10000, false);
        console.log("✅ Attributes added. (Note: Appwrite processes attributes asynchronously)");

    } catch (e) {
        if (e.code === 409) console.log("⏭️ Collection 'Inspections' already exists. Skipping...");
        else throw e;
    }

    // 3. Create Products Collection (For Fingerprinting Registry)
    try {
        console.log(`\nCreating Collection: ${COL_PRODUCTS}`);
        await databases.createCollection(DB_ID, COL_PRODUCTS, 'Products', [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
        ]);
        console.log("✅ Collection 'Products' created successfully.");
        
        console.log("Adding attributes to 'Products'...");
        await databases.createStringAttribute(DB_ID, COL_PRODUCTS, 'productId', 255, true); // Required
        await databases.createStringAttribute(DB_ID, COL_PRODUCTS, 'productName', 255, false);
        await databases.createStringAttribute(DB_ID, COL_PRODUCTS, 'brand', 255, false);
        await databases.createStringAttribute(DB_ID, COL_PRODUCTS, 'barcode', 255, false);
        
    } catch (e) {
        if (e.code === 409) console.log("⏭️ Collection 'Products' already exists. Skipping...");
        else throw e;
    }

    // 4. Create Storage Buckets with Public Read Access
    const publicPermissions = [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
    ];

    try {
        console.log(`\nCreating Bucket: ${BUCKET_IMAGES}`);
        await storage.createBucket(
            BUCKET_IMAGES,
            'Inspection Images',
            publicPermissions,
            false,
            true, // Enable file security
            10000000, // max 10MB
            ['jpg', 'jpeg', 'png', 'webp'] // allowed extensions
        );
        console.log("✅ Bucket 'Inspection Images' created.");
    } catch (e) {
        if (e.code === 409) console.log("⏭️ Bucket 'Inspection Images' already exists.");
        else throw e;
    }

    try {
        console.log(`\nCreating Bucket: ${BUCKET_REPORTS}`);
        await storage.createBucket(
            BUCKET_REPORTS,
            'Generated PDF Reports',
            publicPermissions,
            false,
            true,
            10000000,
            ['pdf', 'json']
        );
        console.log("✅ Bucket 'Generated PDF Reports' created.");
    } catch (e) {
        if (e.code === 409) console.log("⏭️ Bucket 'Generated PDF Reports' already exists.");
        else throw e;
    }

    console.log("\n🎉 Setup Complete! Your Appwrite Database & Storage are fully structured.");
}

setup().catch(console.error);
