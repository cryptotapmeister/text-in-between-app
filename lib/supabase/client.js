import { createClient } from '@supabase/supabase-js';

// Check if we have valid environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client with better error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseKey !== 'placeholder-key';
};

// Auth functions with error handling
export async function signUp(email, password) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase is not properly configured' } };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data.user && !error) {
      await supabase.from('profiles').insert([{ user_id: data.user.id }]);
    }
    return { data, error };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Authentication error' } };
  }
}

export async function signIn(email, password) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase is not properly configured' } };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err) {
    return { data: null, error: { message: err.message || 'Authentication error' } };
  }
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: null }; // Silent fail for signout
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return { error: { message: err.message || 'Sign out error' } };
  }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}

export async function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: null } };
  }
  
  try {
    return supabase.auth.onAuthStateChange(callback);
  } catch (err) {
    console.error('Auth state change error:', err);
    return { data: { subscription: null } };
  }
} 