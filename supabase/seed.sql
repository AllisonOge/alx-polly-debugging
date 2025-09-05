-- Seed file for ALX Polly application
-- This will populate the database with sample data for testing

-- Sample polls (Note: Replace 'auth.users' IDs with actual user IDs from your database)
-- You'll need to create users first or modify this to use your own user IDs

-- Insert sample polls
INSERT INTO polls (id, user_id, question, options, created_at)
VALUES 
  -- Replace these UUIDs with actual user IDs from your auth.users table
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'What is your favorite programming language?', 
   ARRAY['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'], NOW() - INTERVAL '2 days'),
  
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Which frontend framework do you prefer?', 
   ARRAY['React', 'Vue', 'Angular', 'Svelte'], NOW() - INTERVAL '1 day'),
   
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'What is your preferred database?', 
   ARRAY['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'], NOW());

-- Insert sample votes
INSERT INTO votes (poll_id, user_id, option_index, created_at)
VALUES
  -- Votes for poll 1
  ('11111111-1111-1111-1111-111111111111', NULL, 0, NOW() - INTERVAL '1 day 2 hours'),
  ('11111111-1111-1111-1111-111111111111', NULL, 1, NOW() - INTERVAL '1 day 1 hour'),
  ('11111111-1111-1111-1111-111111111111', NULL, 1, NOW() - INTERVAL '1 day'),
  ('11111111-1111-1111-1111-111111111111', NULL, 2, NOW() - INTERVAL '20 hours'),
  ('11111111-1111-1111-1111-111111111111', NULL, 0, NOW() - INTERVAL '15 hours'),
  
  -- Votes for poll 2
  ('22222222-2222-2222-2222-222222222222', NULL, 0, NOW() - INTERVAL '12 hours'),
  ('22222222-2222-2222-2222-222222222222', NULL, 0, NOW() - INTERVAL '10 hours'),
  ('22222222-2222-2222-2222-222222222222', NULL, 2, NOW() - INTERVAL '8 hours'),
  
  -- Votes for poll 3
  ('33333333-3333-3333-3333-333333333333', NULL, 0, NOW() - INTERVAL '5 hours'),
  ('33333333-3333-3333-3333-333333333333', NULL, 0, NOW() - INTERVAL '3 hours'),
  ('33333333-3333-3333-3333-333333333333', NULL, 3, NOW() - INTERVAL '2 hours'),
  ('33333333-3333-3333-3333-333333333333', NULL, 4, NOW() - INTERVAL '1 hour');

-- Note: To use this seed file with actual users, you'll need to:
-- 1. Create users through Supabase Auth
-- 2. Get their user IDs
-- 3. Replace the placeholder '00000000-0000-0000-0000-000000000000' with actual user IDs