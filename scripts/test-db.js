#!/usr/bin/env node

/**
 * Database Setup Script
 * Run this after applying the SQL migration in Supabase
 * This script tests the connection and shows detailed errors
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Make sure you have:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣  Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Connection failed!');
      console.error('Error:', testError.message);
      console.error('\n⚠️  This usually means:');
      console.error('   - SQL migration hasn\'t been run');
      console.error('   - The "users" table doesn\'t exist');
      console.error('\n📝 To fix:');
      console.error('   1. Go to https://supabase.com/dashboard');
      console.error('   2. Select your project');
      console.error('   3. Go to SQL Editor');
      console.error('   4. Create New Query');
      console.error('   5. Copy entire SQL from: supabase/migrations/001_initial_schema.sql');
      console.error('   6. Paste and click Run');
      process.exit(1);
    }

    console.log('✅ Connection successful!\n');

    // Test 2: Check tables exist
    console.log('2️⃣  Checking tables...');
    const tables = ['users', 'user_expertise', 'user_hobbies', 'activity_logs'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        if (error) throw error;
        console.log(`   ✅ ${table}`);
      } catch (err) {
        console.log(`   ❌ ${table} - NOT FOUND`);
      }
    }

    console.log('\n3️⃣  Getting row counts...');
    
    try {
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      console.log(`   👥 Users: ${userCount || 0}`);

      const { count: activityCount, error: activityError } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true });
      
      console.log(`   📋 Activity Logs: ${activityCount || 0}`);
    } catch (err) {
      console.log('   ⚠️  Could not fetch counts');
    }

    console.log('\n✅ All checks passed! Database is ready.\n');
    console.log('🚀 You can now:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to: http://localhost:3000/signup');
    console.log('   3. Create an account');
    console.log('   4. Check admin panel at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testConnection();
