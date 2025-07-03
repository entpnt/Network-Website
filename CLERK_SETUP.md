# Clerk Authentication Setup

This project now uses Clerk for user authentication with Supabase integration. Follow these steps to set up Clerk and Supabase:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose "React" as your framework

## 2. Get Your Publishable Key

1. In your Clerk dashboard, go to the "API Keys" section
2. Copy your "Publishable Key" (starts with `pk_test_` or `pk_live_`)

## 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Get your project URL and anon key from the API settings

## 4. Set Up Environment Variables

Create a `.env` file in your project root and add:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the values with your actual keys.

## 5. Configure Clerk Settings

In your Clerk dashboard:

1. **Authentication Methods**: Enable email/password authentication
2. **User Profile**: Configure what fields you want to collect
3. **Redirect URLs**: Add your local development URL (e.g., `http://localhost:5173/signup-flow`)
4. **JWT Templates**: Create a JWT template for Supabase:
   - Go to "JWT Templates" in your Clerk dashboard
   - Create a new template named "supabase"
   - Use the Supabase JWT template configuration

## 6. Configure Supabase Authentication

In your Supabase dashboard:

1. **Authentication Settings**: Go to Authentication > Settings
2. **Enable JWT**: Enable JWT authentication
3. **JWT Secret**: Copy the JWT secret from your Clerk JWT template
4. **Row Level Security**: Enable RLS on your tables for security

## 7. Customize Appearance (Optional)

The Clerk SignUp component is already styled to match your brand colors. You can further customize the appearance in the `SignUp.tsx` file by modifying the `appearance` prop.

## 8. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/signup-flow`
3. Try creating an account using the Clerk form
4. The form should automatically proceed to the next step once authentication is complete
5. Test Supabase integration by using the `useSupabase()` hook in your components

## Features

- **Automatic Progression**: Once a user signs up with Clerk, they automatically proceed to the next step
- **User Data Integration**: The user's email is automatically populated from Clerk
- **Styled Integration**: The Clerk form is styled to match your existing design
- **Redirect Handling**: Users are redirected back to the signup flow after authentication
- **Supabase Integration**: Authenticated Supabase client with automatic JWT token handling
- **Type Safety**: Full TypeScript support for both Clerk and Supabase

## Usage Examples

### Using the Supabase Hook

```tsx
import { useSupabase } from '../lib/supabase';

function MyComponent() {
  const supabase = useSupabase();
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('your_table')
      .select('*');
    
    if (error) console.error('Error:', error);
    else console.log('Data:', data);
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Troubleshooting

- Make sure your Clerk publishable key is correct
- Check that your redirect URLs are properly configured in Clerk
- Ensure your environment variables are loaded correctly
- Check the browser console for any authentication errors
- Verify that your JWT template is properly configured in Clerk
- Ensure Supabase JWT authentication is enabled 