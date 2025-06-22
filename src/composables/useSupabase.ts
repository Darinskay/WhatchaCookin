import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

export const useSupabase = () => {
  const isAuthenticated = computed(() => !!user.value)

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updateProfile = async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser(updates)
    return { data, error }
  }

  // Initialize auth state
  const initializeAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  // Listen for auth changes
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
      loading.value = false
    })
  }

  return {
    // State
    user: computed(() => user.value),
    session: computed(() => session.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    
    // Methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    initializeAuth,
    setupAuthListener,
    
    // Direct access to supabase client
    supabase
  }
}

// Auto-initialize when composable is imported
const { initializeAuth, setupAuthListener } = useSupabase()
initializeAuth()
setupAuthListener() 