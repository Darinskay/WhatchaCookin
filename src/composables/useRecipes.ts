import { ref, computed } from 'vue';
import { generateRecipe, generateMultipleRecipes, type Recipe, type RecipeRequest } from '@/services/openai';
import { useSupabase } from '@/composables/useSupabase';

const { supabase, user } = useSupabase();

// Global state
const currentRecipe = ref<Recipe | null>(null);
const generatedRecipes = ref<Recipe[]>([]);
const favoriteRecipes = ref<Recipe[]>([]);
const isGenerating = ref(false);
const error = ref<string | null>(null);

export const useRecipes = () => {
  // Computed properties
  const hasRecipes = computed(() => generatedRecipes.value.length > 0);
  const hasFavorites = computed(() => favoriteRecipes.value.length > 0);

  // Generate a single recipe
  const generateSingleRecipe = async (request: RecipeRequest): Promise<Recipe | null> => {
    isGenerating.value = true;
    error.value = null;

    try {
      const recipe = await generateRecipe(request);
      currentRecipe.value = recipe;
      
      // Add to generated recipes list (in-memory only)
      generatedRecipes.value.unshift(recipe);

      return recipe;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate recipe';
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  // Generate multiple recipes
  const generateRecipeOptions = async (request: RecipeRequest, count: number = 3): Promise<Recipe[]> => {
    isGenerating.value = true;
    error.value = null;

    try {
      const recipes = await generateMultipleRecipes(request, count);
      // Add to generated recipes list (in-memory only)
      generatedRecipes.value = [...recipes, ...generatedRecipes.value];

      return recipes;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate recipes';
      return [];
    } finally {
      isGenerating.value = false;
    }
  };

  // Add recipe to favorites
  const addToFavorites = async (recipe: Recipe): Promise<boolean> => {
    try {
      // Check if already in favorites
      const isAlreadyFavorite = favoriteRecipes.value.some(fav => fav.name === recipe.name);
      if (isAlreadyFavorite) {
        error.value = 'Recipe is already in favorites';
        return false;
      }

      favoriteRecipes.value.push(recipe);

      // Save to database if user is authenticated
      if (user.value) {
        await saveRecipeToDatabase(recipe, 'favorite');
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add to favorites';
      return false;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (recipeName: string): Promise<boolean> => {
    try {
      const index = favoriteRecipes.value.findIndex(recipe => recipe.name === recipeName);
      if (index === -1) {
        error.value = 'Recipe not found in favorites';
        return false;
      }

      favoriteRecipes.value.splice(index, 1);

      // Remove from database if user is authenticated
      if (user.value) {
        await removeRecipeFromDatabase(recipeName, 'favorite');
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove from favorites';
      return false;
    }
  };

  // Check if recipe is in favorites
  const isInFavorites = (recipeName: string): boolean => {
    return favoriteRecipes.value.some(recipe => recipe.name === recipeName);
  };

  // Load user's saved recipes from database
  const loadUserRecipes = async (): Promise<void> => {
    if (!user.value) return;

    try {
      // Load favorites only (generated recipes are not persisted)
      const { data: favorites, error: favError } = await supabase
        .from('user_recipes')
        .select('recipe_data')
        .eq('user_id', user.value.id)
        .eq('type', 'favorite');

      if (favError) throw favError;

      favoriteRecipes.value = favorites?.map(item => item.recipe_data) || [];
    } catch (err) {
      console.error('Error loading user recipes:', err);
      error.value = 'Failed to load saved recipes';
    }
  };

  // Save recipe to database
  const saveRecipeToDatabase = async (recipe: Recipe, type: 'favorite' | 'generated'): Promise<void> => {
    if (!user.value) return;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .upsert({
          user_id: user.value.id,
          recipe_name: recipe.name,
          recipe_data: recipe,
          type: type,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,recipe_name,type'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving recipe to database:', err);
      throw err;
    }
  };

  // Remove recipe from database
  const removeRecipeFromDatabase = async (recipeName: string, type: 'favorite' | 'generated'): Promise<void> => {
    if (!user.value) return;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('user_id', user.value.id)
        .eq('recipe_name', recipeName)
        .eq('type', type);

      if (error) throw error;
    } catch (err) {
      console.error('Error removing recipe from database:', err);
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  // Clear all recipes
  const clearRecipes = () => {
    currentRecipe.value = null;
    generatedRecipes.value = [];
  };

  return {
    // State
    currentRecipe: computed(() => currentRecipe.value),
    generatedRecipes: computed(() => generatedRecipes.value),
    favoriteRecipes: computed(() => favoriteRecipes.value),
    isGenerating: computed(() => isGenerating.value),
    error: computed(() => error.value),
    hasRecipes,
    hasFavorites,

    // Methods
    generateSingleRecipe,
    generateRecipeOptions,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    loadUserRecipes,
    clearError,
    clearRecipes
  };
}; 