# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be fully initialized

## 2. Get Your Project Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy your Project URL and anon/public key
3. Update your `.env.local` file with the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Run the query to create all tables, policies, and functions

## 4. Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Add your site URL to the redirect URLs:
   - `http://localhost:3001/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### Enable Google OAuth (Optional)

1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URIs in Google Console:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

## 5. Test the Setup

1. Start your development server: `bun dev`
2. Navigate to `http://localhost:3001/auth/signin`
3. Try signing up with email/password
4. Check your email for verification
5. Try signing in after verification

## Features Included

✅ **Authentication System**
- Email/password authentication
- Google OAuth integration
- Protected routes
- Session management

✅ **WorkOS-Style UI**
- Animated auth cards
- Smooth transitions
- Modern design system
- Responsive layout

✅ **Database Schema**
- User profiles
- Projects management
- Tasks system
- Row Level Security (RLS)

✅ **API Routes**
- Authentication callbacks
- Profile management
- Protected endpoints

## File Structure

```
apps/web/src/
├── app/
│   ├── api/
│   │   ├── auth/callback/    # OAuth callback
│   │   └── profile/          # Profile management
│   ├── auth/
│   │   ├── signin/           # Sign in page
│   │   └── signup/           # Sign up page
│   └── dashboard/            # Protected dashboard
├── components/ui/
│   ├── animated-auth-card.tsx
│   ├── animated-button.tsx
│   └── animated-input.tsx
├── contexts/
│   └── auth-context.tsx      # Auth state management
└── lib/
    └── supabase.ts           # Supabase client
```

## Troubleshooting

- **Build errors**: Make sure all environment variables are set correctly
- **Auth not working**: Check redirect URLs in Supabase dashboard
- **Database errors**: Verify the schema was created properly
- **OAuth issues**: Ensure OAuth providers are configured correctly

## Next Steps

1. Customize the UI components to match your brand
2. Add more features like user profiles, projects, and tasks
3. Implement real-time features with Supabase subscriptions
4. Add more OAuth providers as needed
5. Deploy to production with proper environment variables