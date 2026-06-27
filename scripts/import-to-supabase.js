#!/usr/bin/env node
/**
 * Supabase Data Import Script
 * 
 * Usage:
 * 1. Set environment variables (see .env.example)
 * 2. Run: node scripts/import-to-supabase.js
 * 3. This will import export-data.json to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://wrmhbzyvmktztwcjretk.supabase.co`;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY not found in environment');
    console.error('Please add it to .env.local or environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function importVideos(videos) {
    console.log(`Importing ${videos.length} videos...`);
    
    for (const video of videos) {
        const { id, createdAt, updatedAt, ...data } = video;
        
        // Prepare data for Supabase
        const insertData = {
            id: id,
            title: data.title,
            artist: data.artist,
            category: data.category,
            image: data.image,
            video_url: data.videoUrl,
            year: data.year,
            director: data.director,
            cinematographer: data.cinematographer,
            editor: data.editor,
            producer: data.producer,
            description: data.description,
            order: data.order || 999,
            created_at: createdAt || new Date().toISOString(),
            updated_at: updatedAt || new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('videos')
            .upsert(insertData, { onConflict: 'id' });
        
        if (error) {
            console.error(`Error importing video ${id}:`, error.message);
        }
    }
    
    console.log('Videos imported successfully');
}

async function importPhotos(photos) {
    console.log(`Importing ${photos.length} photos...`);
    
    for (const photo of photos) {
        const { id, createdAt, updatedAt, images, src, ...data } = photo;
        
        // Handle both old 'src' format and new 'images' array format
        const imageArray = images && images.length > 0 ? images : (src ? [src] : []);
        
        const insertData = {
            id: id,
            images: imageArray,
            alt: data.alt,
            photographer: data.photographer,
            location: data.location,
            date: data.date,
            camera: data.camera,
            order: data.order || 999,
            created_at: createdAt || new Date().toISOString(),
            updated_at: updatedAt || new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('photos')
            .upsert(insertData, { onConflict: 'id' });
        
        if (error) {
            console.error(`Error importing photo ${id}:`, error.message);
        }
    }
    
    console.log('Photos imported successfully');
}

async function importUsers(users) {
    console.log(`Importing ${users.length} users...`);
    
    for (const user of users) {
        const { id, role, ...data } = user;
        
        // Firestore uses UID as document ID
        const insertData = {
            id: id, // This should be the Firebase UID
            firebase_uid: id,
            email: data.email || `${id}@firebase.local`, // Will need to be updated with real email
            role: role || 'admin',
            created_at: new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('users')
            .upsert(insertData, { onConflict: 'id' });
        
        if (error) {
            console.error(`Error importing user ${id}:`, error.message);
        }
    }
    
    console.log('Users imported successfully');
}

async function main() {
    try {
        // Load exported data
        const exportPath = path.join(__dirname, '../export-data.json');
        
        if (!fs.existsSync(exportPath)) {
            console.error('export-data.json not found. Run export-firestore.js first.');
            process.exit(1);
        }
        
        const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
        
        console.log('Starting Supabase import...');
        console.log(`Data exported at: ${exportData.exportedAt}`);
        
        // Import in order (users first for foreign key references if needed)
        await importUsers(exportData.users || []);
        await importVideos(exportData.videos || []);
        await importPhotos(exportData.photos || []);
        
        console.log('\nImport complete!');
        
        // Verify counts
        const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
        const { count: photoCount } = await supabase.from('photos').select('*', { count: 'exact', head: true });
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        
        console.log(`\nVerified counts in Supabase:`);
        console.log(`Videos: ${videoCount}`);
        console.log(`Photos: ${photoCount}`);
        console.log(`Users: ${userCount}`);
        
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

main();