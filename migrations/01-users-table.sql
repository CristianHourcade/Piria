-- Create users table with enhanced structure
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'colaborador',
  initials TEXT,
  avatar_url TEXT,
  phone TEXT,
  position TEXT,
  preferences JSONB DEFAULT '{"theme": "system", "notifications": {"channels": {"email": true, "browser": true, "mobile": false}, "types": {"taskAssigned": true, "taskDeadline": true, "taskUpdated": true, "projectUpdated": true, "clientUpdated": false, "teamMessages": true, "approvalRequests": true, "systemUpdates": false}}}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS users_auth_id_idx ON public.users(auth_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY users_select_self ON public.users
  FOR SELECT USING (auth.uid() = auth_id);

-- Policy: Users can update their own profile
CREATE POLICY users_update_self ON public.users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Policy: Admins can view all users
CREATE POLICY users_select_admin ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update all users
CREATE POLICY users_update_admin ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can insert new users
CREATE POLICY users_insert_admin ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can delete users
CREATE POLICY users_delete_admin ON public.users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle user creation from auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  name_value TEXT;
  initials_value TEXT;
BEGIN
  -- Extract name from email if not provided in user_metadata
  name_value := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Generate initials from name
  SELECT STRING_AGG(LEFT(word, 1), '') INTO initials_value
  FROM (
    SELECT TRIM(word) AS word
    FROM regexp_split_to_table(name_value, '\s+') AS word
    WHERE TRIM(word) <> ''
  ) AS words;
  
  initials_value := COALESCE(NULLIF(initials_value, ''), UPPER(LEFT(name_value, 1)));
  
  -- Insert new user
  INSERT INTO public.users (
    auth_id,
    name,
    email,
    role,
    initials,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    name_value,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador'),
    UPPER(initials_value),
    NOW(),
    NOW()
  )
  ON CONFLICT (auth_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
