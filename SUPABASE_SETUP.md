# Supabase Setup Guide for WhatchaCookin

This guide will walk you through setting up Supabase for your WhatchaCookin Ionic Vue app.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your WhatchaCookin app running locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `whatchacookin` (or your preferred name)
   - Database Password: Generate a strong password and save it
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Project API Key (anon, public)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (same level as `package.json`):

```bash
# Copy .env.example to .env
cp .env.example .env
```

2. Edit the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the actual values from your Supabase project.

## Step 4: Set Up Database Schema

Run the following SQL commands in your Supabase SQL Editor (Database → SQL Editor):

### 1. Enable Row Level Security and Create Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Create Recipes Table

```sql
-- Create recipes table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public recipes are viewable by everyone." ON recipes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own recipes." ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes." ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes." ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes." ON recipes
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Create Favorites Table

```sql
-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites." ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites." ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites." ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Create Profile Trigger

```sql
-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5. Create Updated At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure your authentication settings:
   - **Site URL**: Add your local development URL (e.g., `http://localhost:8100`)
   - **Redirect URLs**: Add any additional URLs you'll use for redirects
   - **Email Templates**: Customize your email templates if needed

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open your app in the browser
3. Try signing up with a new account
4. Check your Supabase dashboard to see if:
   - The user was created in Authentication → Users
   - A profile was automatically created in Database → Table Editor → profiles

## Features Included

The Supabase integration includes:

### Authentication
- ✅ User registration
- ✅ User login
- ✅ Password reset
- ✅ User profile management
- ✅ Authentication state management

### Database Services
- ✅ Generic database operations (CRUD)
- ✅ Recipe management
- ✅ User profiles
- ✅ Favorites system
- ✅ Row Level Security (RLS)

### Vue Composables
- ✅ `useSupabase()` - Main authentication composable
- ✅ Reactive authentication state
- ✅ Auto-initialization of auth state

### Components
- ✅ `AuthForm.vue` - Sign in/up form
- ✅ `UserProfile.vue` - User profile display
- ✅ Updated `Tab1Page.vue` with auth integration

## Usage Examples

### Using the Supabase Composable

```typescript
import { useSupabase } from '@/composables/useSupabase'

const { user, isAuthenticated, signIn, signOut } = useSupabase()

// Check if user is logged in
if (isAuthenticated.value) {
  console.log('User is logged in:', user.value)
}

// Sign in a user
const { error } = await signIn('email@example.com', 'password')
```

### Using Database Services

```typescript
import { RecipeService } from '@/services/database'

// Get user's recipes
const { data: recipes, error } = await RecipeService.getUserRecipes()

// Create a new recipe
const { data: newRecipe, error } = await RecipeService.createRecipe({
  title: 'My Amazing Recipe',
  description: 'A delicious recipe',
  ingredients: ['ingredient 1', 'ingredient 2'],
  instructions: ['step 1', 'step 2']
})
```

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only access their own data
- ✅ Public recipes are accessible to everyone
- ✅ Environment variables are used for sensitive data
- ✅ Authentication is handled securely by Supabase

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Ensure variable names start with `VITE_`

2. **Authentication errors**
   - Check your Supabase project URL and API key
   - Verify your Site URL in Supabase authentication settings
   - Check browser console for detailed error messages

3. **Database permission errors**
   - Ensure Row Level Security policies are set up correctly
   - Check if the user is authenticated before making database calls
   - Verify table permissions in Supabase dashboard

4. **Import errors**
   - Make sure the `@/` alias is working (check `vite.config.ts`)
   - Verify all imports are correct and files exist

## Next Steps

Now that Supabase is set up, you can:

1. **Customize the UI**: Modify the authentication forms and profile components
2. **Add more features**: Implement recipe sharing, comments, ratings
3. **Add file storage**: Use Supabase Storage for recipe images
4. **Add real-time features**: Use Supabase Realtime for live updates
5. **Deploy your app**: Set up production environment variables

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Vue Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-vue-3)
- [Ionic Vue Documentation](https://ionicframework.com/docs/vue/overview)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html) 