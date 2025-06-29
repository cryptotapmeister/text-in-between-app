import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Auth functions
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (data.user) {
    await supabase.from('profiles').insert([{ user_id: data.user.id }]);
  }
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
} 