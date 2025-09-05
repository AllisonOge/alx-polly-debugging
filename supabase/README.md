# Supabase Database Migrations

This directory contains SQL migrations for initializing and updating the database schema for the ALX Polly application.

## Initial Schema

The initial schema creates the following tables:

- `polls`: Stores poll questions, options, and metadata
- `votes`: Records votes cast on polls

It also sets up appropriate Row Level Security (RLS) policies to ensure data security.

## How to Apply Migrations

To initialize your database with these migrations using the Supabase CLI, follow these steps:

### Prerequisites

1. Install the Supabase CLI if you haven't already:

```bash
npm install -g supabase
```

2. Log in to your Supabase account:

```bash
supabase login
```

### Initialize Supabase in Your Project

If you haven't already initialized Supabase in your project:

```bash
supabase init
```

### Link Your Project

Link your local project to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

You can find your project reference in the Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`

### Apply Migrations

Run the following command to apply the migrations to your Supabase project:

```bash
supabase db push
```

This will apply all migrations in the `migrations` directory to your database.

## Verifying the Setup

After applying the migrations, you can verify the setup by:

1. Checking the Tables section in the Supabase dashboard
2. Running a test query using the SQL editor in the Supabase dashboard:

```sql
SELECT * FROM polls;
SELECT * FROM votes;
```

## Creating New Migrations

To create a new migration file:

```bash
supabase migration new migration_name
```

This will create a new timestamped SQL file in the `migrations` directory where you can add your schema changes.