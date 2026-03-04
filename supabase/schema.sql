-- Auraa OS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  avatar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Pending')) DEFAULT 'Active',
  activity TEXT DEFAULT 'Just now',
  monthly_projects INTEGER DEFAULT 0,
  this_month_projects JSONB DEFAULT '[]',
  total_projects INTEGER DEFAULT 0,
  client_since TEXT DEFAULT (NOW()::TEXT),
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  budget TEXT NOT NULL CHECK (budget IN ('Premium', 'Standard', 'Basic')) DEFAULT 'Standard',
  image TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planning', 'in-progress', 'review', 'completed')) DEFAULT 'planning',
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  deadline TEXT,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  team JSONB DEFAULT '[]',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('client', 'project', 'user')),
  target_id UUID NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON activity_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Admin can insert users" ON users
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can update all users" ON users
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Clients table policies
CREATE POLICY "Everyone can view clients" ON clients
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert clients" ON clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update all clients" ON clients
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update their own clients" ON clients
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admin can delete all clients" ON clients
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can delete their own clients" ON clients
    FOR DELETE USING (created_by = auth.uid());

-- Projects table policies
CREATE POLICY "Everyone can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update all projects" ON projects
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admin can delete all projects" ON projects
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (created_by = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can view activity logs" ON activity_logs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default admin user
INSERT INTO users (id, name, email, role, status, avatar)
VALUES (
  uuid_generate_v4(),
  'Prash',
  'prash@auraa.com',
  'admin',
  'active',
  'P'
) ON CONFLICT (email) DO NOTHING;
