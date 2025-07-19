-- Users table
CREATE TABLE IF NOT EXISTS Users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text,
  created_at timestamp DEFAULT now()
);

-- ProgressEntries table
CREATE TABLE IF NOT EXISTS ProgressEntries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES Users(id),
  mood integer CHECK (mood >= 1 AND mood <= 5),
  journal_text text,
  timestamp timestamp DEFAULT now()
); 