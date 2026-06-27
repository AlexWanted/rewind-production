#!/usr/bin/env node
/**
 * Firestore to Supabase Data Migration Script
 * 
 * Usage:
 * 1. Set FIREBASE_SERVICE_ACCOUNT_KEY_PATH env var to your Firebase service account JSON
 * 2. Run: node scripts/export-firestore.js
 * 3. This will create export-data.json with all Firestore data
 */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Load Firebase service account
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './firebase-service-account.json';

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Firebase service account key not found at:', serviceAccountPath);
    console.error('Please set FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable');
    process.exit(1);
}

const serviceAccount = require(path.resolve(serviceAccountPath));

// Initialize Firebase Admin
const app = getApps().length === 0 ? initializeApp({
    credential: cert(serviceAccount)
}) : getApps()[0];

const db = getFirestore(app);

async function exportCollection(collectionName) {
    console.log(`Exporting ${collectionName}...`);
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach(doc => {
        const docData = doc.data();
        // Convert Firestore Timestamps to ISO strings
        const convertedData = convertTimestamps(docData);
        data.push({
            id: doc.id,
            ...convertedData
        });
    });
    
    console.log(`Exported ${data.length} documents from ${collectionName}`);
    return data;
}

function convertTimestamps(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    if (obj instanceof Date) {
        return obj.toISOString();
    }
    
    // Check for Firestore Timestamp (has toMillis method)
    if (obj && typeof obj.toMillis === 'function') {
        return new Date(obj.toMillis()).toISOString();
    }
    
    if (Array.isArray(obj)) {
        return obj.map(convertTimestamps);
    }
    
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = convertTimestamps(value);
    }
    return result;
}

async function main() {
    try {
        console.log('Starting Firestore export...');
        
        const [videos, photos, users] = await Promise.all([
            exportCollection('videos'),
            exportCollection('photos'),
            exportCollection('users')
        ]);
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            videos,
            photos,
            users
        };
        
        const outputPath = path.join(__dirname, '../export-data.json');
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        
        console.log('\nExport complete!');
        console.log(`Data saved to: ${outputPath}`);
        console.log(`Videos: ${videos.length}`);
        console.log(`Photos: ${photos.length}`);
        console.log(`Users: ${users.length}`);
        
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

main();