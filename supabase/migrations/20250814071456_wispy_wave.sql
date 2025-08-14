/*
  # Job Aggregation Platform Database Schema

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `logo_url` (text)
      - `industry` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `external_id` (text, unique per platform)
      - `title` (text)
      - `company_id` (uuid, foreign key to companies)
      - `location` (text)
      - `description` (text)
      - `requirements` (text array)
      - `salary_min` (integer)
      - `salary_max` (integer)
      - `currency` (text)
      - `job_type` (text)
      - `is_remote` (boolean)
      - `platform` (text)
      - `external_url` (text)
      - `posted_at` (timestamp)
      - `expires_at` (timestamp)
      - `relevance_score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since this is a job board)
    - Add admin policies for data management

  3. Indexes
    - Create indexes for optimal query performance
    - Full-text search indexes for job search functionality
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  logo_url text,
  industry text DEFAULT 'Technology',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL,
  title text NOT NULL,
  company_id uuid REFERENCES companies(id),
  location text,
  description text,
  requirements text[] DEFAULT '{}',
  salary_min integer,
  salary_max integer,
  currency text DEFAULT 'USD',
  job_type text DEFAULT 'full-time',
  is_remote boolean DEFAULT false,
  platform text NOT NULL,
  external_url text,
  posted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  relevance_score integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  UNIQUE(external_id, platform)
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public read policies (job boards are typically public)
CREATE POLICY "Companies are publicly readable"
  ON companies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Jobs are publicly readable"
  ON jobs
  FOR SELECT
  TO public
  USING (true);

-- Admin policies for data management (authenticated users can manage data)
CREATE POLICY "Authenticated users can manage companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON jobs(is_remote);
CREATE INDEX IF NOT EXISTS idx_jobs_relevance_score ON jobs(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_min ON jobs(salary_min);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON jobs USING gin(to_tsvector('english', description));

-- Company name index
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);