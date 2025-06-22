<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div class="app-title">
            <ion-icon :icon="restaurantOutline" class="title-icon"></ion-icon>
            Fridge
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <div class="app-title">
              <ion-icon :icon="restaurantOutline" class="title-icon"></ion-icon>
              Fridge
            </div>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-content">
          <ion-spinner name="crescent" class="pulse-animation"></ion-spinner>
          <p class="loading-text">Preparing your culinary experience...</p>
        </div>
      </div>

      <!-- Authentication Section -->
      <div v-else-if="!isAuthenticated" class="auth-section">
        <!-- Welcome Card -->
        <ion-card class="welcome-card fade-in-up">
          <div class="welcome-header">
            <ion-icon :icon="restaurantOutline" class="welcome-icon"></ion-icon>
          </div>
          <ion-card-header>
            <ion-card-title class="welcome-title">Welcome to WhatchaCookin!</ion-card-title>
            <ion-card-subtitle class="welcome-subtitle">Your AI-powered culinary companion</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p class="welcome-description">
              🍳 Generate recipes from your ingredients<br>
              💡 Get personalized cooking suggestions<br>
              📱 Save and organize your favorites<br>
              👨‍🍳 Join our cooking community
            </p>
          </ion-card-content>
        </ion-card>

        <!-- Authentication Form -->
        <div class="auth-form-container fade-in-up">
          <AuthForm />
        </div>
      </div>

      <!-- Authenticated User Content -->
      <div v-else class="main-content">
        <!-- AI Recipe Generator - Hero Section -->
        <div class="hero-section fade-in-up">
          <FridgeRecipeGenerator 
            @recipeGenerated="handleRecipeGenerated"
            @recipesGenerated="handleRecipesGenerated"
          />
        </div>

        <!-- Generated Recipes Display -->
        <div v-if="currentRecipe" class="recipe-display fade-in-up">
          <div class="section-header">
            <h2 class="section-title">
              <ion-icon :icon="sparklesOutline" class="section-icon"></ion-icon>
              Your Generated Recipe
            </h2>
          </div>
          <RecipeCard 
            :recipe="currentRecipe" 
            @startCookingMode="handleCookingMode"
          />
        </div>

        <!-- Multiple Recipe Options -->
        <div v-if="recipeOptions.length > 0" class="recipe-options fade-in-up">
          <div class="section-header">
            <h2 class="section-title">
              <ion-icon :icon="optionsOutline" class="section-icon"></ion-icon>
              Recipe Options
            </h2>
            <p class="section-subtitle">Choose your favorite from these AI-generated recipes!</p>
          </div>
          
          <div class="recipe-grid">
            <RecipeCard 
              v-for="(recipe, index) in recipeOptions" 
              :key="index"
              :recipe="recipe" 
              @startCookingMode="handleCookingMode"
            />
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue';

import {
  restaurantOutline,
  sparklesOutline,
  optionsOutline
} from 'ionicons/icons';

import { useSupabase } from '@/composables/useSupabase';
import AuthForm from '@/components/AuthForm.vue';
import FridgeRecipeGenerator from '@/components/FridgeRecipeGenerator.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import type { Recipe } from '@/services/openai';

// Supabase integration
const { user, loading, isAuthenticated } = useSupabase();

// Recipe state for current session only
const currentRecipe = ref<Recipe | null>(null);

// Reactive data
const recipeOptions = ref<Recipe[]>([]);

// Recipe generation handlers
const handleRecipeGenerated = (recipe: Recipe) => {
  // Set the current recipe and clear previous options
  currentRecipe.value = recipe;
  recipeOptions.value = [];
  console.log('Recipe generated:', recipe.name);
};

const handleRecipesGenerated = (recipes: Recipe[]) => {
  // Set recipe options for display and clear single recipe
  currentRecipe.value = null;
  recipeOptions.value = recipes;
  console.log('Multiple recipes generated:', recipes.length);
};

const handleCookingMode = (recipe: Recipe) => {
  console.log('Starting cooking mode for:', recipe.name);
};

// Watch for authentication changes (no need to load saved recipes on Fridge tab)
watch(user, (newUser) => {
  // User authentication handled, but no need to load recipes here
  console.log('User authentication status changed:', !!newUser);
}, { immediate: true });
</script>

<style scoped>
/* App Title Styling */
.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.title-icon {
  font-size: 1.4em;
  color: white;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.loading-content {
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  color: var(--ion-color-medium);
  font-size: 1.1em;
}

/* Authentication Section */
.auth-section {
  padding: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.welcome-card {
  text-align: center;
  background: var(--food-gradient-warm);
  color: white;
  margin-bottom: 24px;
}

.welcome-header {
  padding: 24px 24px 0 24px;
}

.welcome-icon {
  font-size: 4em;
  opacity: 0.9;
}

.welcome-title {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

.welcome-description {
  font-size: 1.1em;
  line-height: 1.6;
  text-align: left;
}

.auth-form-container {
  animation-delay: 0.2s;
}

/* Main Content Layout */
.main-content {
  padding: 8px;
}

.hero-section,
.recipe-display,
.recipe-options {
  margin-bottom: 24px;
}

/* Section Headers */
.section-header {
  padding: 0 16px 16px 16px;
  text-align: center;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.5em;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}

.section-icon {
  font-size: 1.2em;
}

.section-subtitle {
  color: var(--ion-color-medium);
  font-size: 1em;
  margin: 0;
}

/* Recipe Grid */
.recipe-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
  
  .main-content {
    padding: 16px 24px;
  }
}
</style>
