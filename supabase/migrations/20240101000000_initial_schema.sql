-- This migration creates the initial schema for the ALX Polly application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS polls_user_id_idx ON polls(user_id);
CREATE INDEX IF NOT EXISTS votes_poll_id_idx ON votes(poll_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);

-- Create RLS policies for polls table
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all polls
CREATE POLICY "Polls are viewable by everyone" 
  ON polls FOR SELECT 
  USING (true);

-- Policy: Users can insert their own polls
CREATE POLICY "Users can insert their own polls" 
  ON polls FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own polls
CREATE POLICY "Users can update their own polls" 
  ON polls FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own polls
CREATE POLICY "Users can delete their own polls" 
  ON polls FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all votes
CREATE POLICY "Votes are viewable by everyone" 
  ON votes FOR SELECT 
  USING (true);

-- Policy: Users can insert their own votes
CREATE POLICY "Users can insert their own votes" 
  ON votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can't update votes
CREATE POLICY "Users can't update votes" 
  ON votes FOR UPDATE 
  USING (false);

-- Policy: Users can't delete votes
CREATE POLICY "Users can't delete votes" 
  ON votes FOR DELETE 
  USING (false);