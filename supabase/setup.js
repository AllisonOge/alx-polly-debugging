#!/usr/bin/env node

/**
 * This script helps set up the Supabase database for ALX Polly
 * It provides a guided process for running migrations and seed data
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if Supabase CLI is installed
function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if the project is linked to Supabase
function isProjectLinked() {
  try {
    const projectInfo = execSync('supabase status').toString();
    return !projectInfo.includes('not linked');
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  console.log('\n🚀 ALX Polly Database Setup\n');
  
  // Check Supabase CLI
  if (!checkSupabaseCLI()) {
    console.log('❌ Supabase CLI is not installed. Please install it first:');
    console.log('npm install -g supabase');
    process.exit(1);
  }
  
  console.log('✅ Supabase CLI is installed');
  
  // Check if project is linked
  if (!isProjectLinked()) {
    console.log('\n⚠️ Your project is not linked to a Supabase project.');
    const answer = await question('Would you like to link it now? (y/n): ');
    
    if (answer.toLowerCase() === 'y') {
      console.log('\nPlease get your project reference from the Supabase dashboard URL:');
      console.log('https://app.supabase.com/project/YOUR_PROJECT_REF');
      
      const projectRef = await question('Enter your project reference: ');
      try {
        execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
        console.log('\n✅ Project linked successfully');
      } catch (error) {
        console.log('\n❌ Failed to link project');
        process.exit(1);
      }
    } else {
      console.log('\n❌ Project must be linked to continue. Exiting...');
      process.exit(1);
    }
  } else {
    console.log('✅ Project is linked to Supabase');
  }
  
  // Run migrations
  console.log('\n📦 Running database migrations...');
  try {
    execSync('supabase db push', { stdio: 'inherit' });
    console.log('\n✅ Migrations applied successfully');
  } catch (error) {
    console.log('\n❌ Failed to apply migrations');
    process.exit(1);
  }
  
  // Ask about seeding
  const seedAnswer = await question('\nWould you like to seed the database with sample data? (y/n): ');
  
  if (seedAnswer.toLowerCase() === 'y') {
    console.log('\n🌱 Seeding database...');
    try {
      // Execute the seed.sql file
      execSync('supabase db execute --file ./supabase/seed.sql', { stdio: 'inherit' });
      console.log('\n✅ Database seeded successfully');
    } catch (error) {
      console.log('\n❌ Failed to seed database');
      console.error(error.message);
    }
  }
  
  console.log('\n🎉 Setup complete! Your database is ready to use.');
  console.log('\nNext steps:');
  console.log('1. Make sure your .env.local file contains the correct Supabase credentials');
  console.log('2. Start your Next.js application with: npm run dev');
  
  rl.close();
}

// Helper function for prompts
function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// Run the main function
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
