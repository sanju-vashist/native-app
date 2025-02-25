import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://kgibatcvvgzeafdgotsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaWJhdGN2dmd6ZWFmZGdvdHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODkwNjgsImV4cCI6MjA1NTk2NTA2OH0.jrq6ssfrsTcYoN3HHGAtffmFvO0Uhithuo9NBaid_yw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getAnonymousId = async () => {
  let id = await AsyncStorage.getItem('anonymousId');
  if (!id) {
    id = Math.random().toString(36).substr(2, 9);
    await AsyncStorage.setItem('anonymousId', id);
  }
  return id;
};