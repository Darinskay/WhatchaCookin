import { supabase } from '@/lib/supabase'

// Generic database service for common operations
export class DatabaseService {
  // Generic select operation
  static async select<T>(
    table: string,
    columns: string = '*',
    filters?: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    let query = supabase.from(table).select(columns)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const result = await query
    return result as { data: T[] | null; error: any }
  }

  // Generic insert operation
  static async insert<T>(
    table: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    return await supabase.from(table).insert(data).select().single()
  }

  // Generic update operation
  static async update<T>(
    table: string,
    id: string | number,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    return await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  // Generic delete operation
  static async delete(
    table: string,
    id: string | number
  ): Promise<{ error: any }> {
    return await supabase.from(table).delete().eq('id', id)
  }

  // Get current user's data from a table
  static async getUserData<T>(
    table: string,
    columns: string = '*'
  ): Promise<{ data: T[] | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const result = await supabase
      .from(table)
      .select(columns)
      .eq('user_id', user.id)
      
    return result as { data: T[] | null; error: any }
  }
}

// Recipe-specific service
export class RecipeService {
  static async getUserRecipes() {
    return await DatabaseService.getUserData('recipes')
  }

  static async createRecipe(recipe: {
    title: string
    description?: string
    ingredients: string[]
    instructions: string[]
    prep_time?: number
    cook_time?: number
    servings?: number
    difficulty?: string
    category?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    return await DatabaseService.insert('recipes', {
      ...recipe,
      user_id: user.id,
      created_at: new Date().toISOString()
    })
  }

  static async updateRecipe(id: string, updates: any) {
    return await DatabaseService.update('recipes', id, updates)
  }

  static async deleteRecipe(id: string) {
    return await DatabaseService.delete('recipes', id)
  }

  static async getPublicRecipes(limit: number = 20) {
    return await supabase
      .from('recipes')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit)
  }
}

// Profile service
export class ProfileService {
  static async getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
  }

  static async updateProfile(updates: {
    username?: string
    full_name?: string
    avatar_url?: string
    bio?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
  }
}

// Favorites service
export class FavoritesService {
  static async getUserFavorites() {
    return await DatabaseService.getUserData('favorites', `
      *,
      recipes (
        id,
        title,
        description,
        prep_time,
        cook_time,
        difficulty
      )
    `)
  }

  static async addToFavorites(recipeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    return await DatabaseService.insert('favorites', {
      user_id: user.id,
      recipe_id: recipeId,
      created_at: new Date().toISOString()
    })
  }

  static async removeFromFavorites(recipeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'User not authenticated' } }
    }

    return await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
  }
} 