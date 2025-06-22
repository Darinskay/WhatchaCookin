<template>
  <ion-card class="fridge-generator-card">
    <div class="card-header-gradient">
      <ion-card-header>
        <ion-card-subtitle class="main-subtitle">
          Tell us what ingredients you have, and we'll create delicious recipes just for you! ✨
        </ion-card-subtitle>
        <ion-card-title class="main-title">
          <ion-icon :icon="restaurantOutline" class="title-icon"></ion-icon>
          What's in your fridge?
        </ion-card-title>
      </ion-card-header>
    </div>
    
    <ion-card-content class="main-content">
      <!-- Ingredient Input -->
      <div class="ingredient-input-section">
        <div class="input-label">
          <ion-icon :icon="addCircleOutline" color="primary"></ion-icon>
          <span>Add ingredients</span>
        </div>
        <div class="input-container">
          <ion-item class="ingredient-input">
            <ion-input
              v-model="newIngredient"
              placeholder="e.g., chicken, tomatoes, pasta, garlic..."
              @keyup.enter="addIngredient"
              :disabled="isGenerating"
              class="custom-input"
            ></ion-input>
            <ion-button 
              slot="end" 
              fill="clear" 
              @click="addIngredient"
              :disabled="!newIngredient.trim() || isGenerating"
              class="add-button"
            >
              <ion-icon :icon="addOutline" color="primary"></ion-icon>
            </ion-button>
          </ion-item>
        </div>
      </div>

      <!-- Ingredients List -->
      <div v-if="ingredients.length > 0" class="ingredients-display">
        <div class="ingredients-header">
          <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
          <h4>Your ingredients ({{ ingredients.length }}):</h4>
        </div>
        <div class="ingredients-chips">
          <ion-chip 
            v-for="(ingredient, index) in ingredients" 
            :key="index"
            color="success"
            class="ingredient-chip"
            @click="removeIngredient(index)"
          >
            <ion-label>{{ ingredient }}</ion-label>
            <ion-icon :icon="closeOutline" class="remove-icon"></ion-icon>
          </ion-chip>
        </div>
      </div>

      <!-- Recipe Preferences -->
      <div class="preferences-section">
        <div class="preferences-header">
          <ion-icon :icon="optionsOutline" color="tertiary"></ion-icon>
          <h4>Customize your recipe (optional):</h4>
        </div>
        
        <div class="preferences-grid">
          <ion-item class="preference-item">
            <ion-icon :icon="globeOutline" slot="start" color="primary"></ion-icon>
            <ion-label>Cuisine Style</ion-label>
            <ion-select v-model="preferences.cuisine" placeholder="Any cuisine" interface="popover">
              <ion-select-option value="">Any cuisine</ion-select-option>
              <ion-select-option value="Italian">🇮🇹 Italian</ion-select-option>
              <ion-select-option value="Mediterranean">🌊 Mediterranean</ion-select-option>
              <ion-select-option value="Asian">🥢 Asian</ion-select-option>
              <ion-select-option value="Mexican">🌮 Mexican</ion-select-option>
              <ion-select-option value="American">🇺🇸 American</ion-select-option>
              <ion-select-option value="Indian">🇮🇳 Indian</ion-select-option>
              <ion-select-option value="French">🇫🇷 French</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="preference-item">
            <ion-icon :icon="timeOutline" slot="start" color="warning"></ion-icon>
            <ion-label>Cooking Time</ion-label>
            <ion-select v-model="preferences.cookingTime" placeholder="Any time" interface="popover">
              <ion-select-option value="">Any time</ion-select-option>
              <ion-select-option value="15 minutes">⚡ Quick (15 min)</ion-select-option>
              <ion-select-option value="30 minutes">⏱️ Medium (30 min)</ion-select-option>
              <ion-select-option value="60 minutes">🕐 Long (1 hour)</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="preference-item">
            <ion-icon :icon="barChartOutline" slot="start" color="secondary"></ion-icon>
            <ion-label>Difficulty</ion-label>
            <ion-select v-model="preferences.difficulty" placeholder="Any difficulty" interface="popover">
              <ion-select-option value="">Any difficulty</ion-select-option>
              <ion-select-option value="Easy">🟢 Easy</ion-select-option>
              <ion-select-option value="Medium">🟡 Medium</ion-select-option>
              <ion-select-option value="Hard">🔴 Hard</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="preference-item">
            <ion-icon :icon="peopleOutline" slot="start" color="success"></ion-icon>
            <ion-label>Servings</ion-label>
            <ion-select v-model="preferences.servings" placeholder="4 servings" interface="popover">
              <ion-select-option value="1">1 serving</ion-select-option>
              <ion-select-option value="2">2 servings</ion-select-option>
              <ion-select-option value="4">4 servings</ion-select-option>
              <ion-select-option value="6">6 servings</ion-select-option>
              <ion-select-option value="8">8 servings</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <!-- Dietary Restrictions -->
        <div class="dietary-section">
          <div class="dietary-header">
            <ion-icon :icon="leafOutline" color="success"></ion-icon>
            <h5>Dietary preferences:</h5>
          </div>
          <div class="dietary-chips">
            <ion-chip 
              v-for="restriction in availableRestrictions" 
              :key="restriction"
              :color="preferences.dietaryRestrictions.includes(restriction) ? 'success' : 'medium'"
              class="dietary-chip"
              @click="toggleDietaryRestriction(restriction)"
            >
              <ion-icon 
                v-if="preferences.dietaryRestrictions.includes(restriction)" 
                :icon="checkmarkOutline"
                slot="start"
              ></ion-icon>
              <ion-label>{{ restriction }}</ion-label>
            </ion-chip>
          </div>
        </div>

        <!-- Macronutrient Focus -->
        <div class="macro-section">
          <div class="macro-header">
            <ion-icon :icon="nutritionOutline" color="primary"></ion-icon>
            <h5>Focus on macronutrients:</h5>
          </div>
          <div class="macro-chips">
            <ion-chip 
              v-for="macro in availableMacros" 
              :key="macro.name"
              :color="preferences.macronutrientFocus.includes(macro.name) ? 'primary' : 'medium'"
              class="macro-chip"
              @click="toggleMacronutrientFocus(macro.name)"
            >
              <ion-icon 
                v-if="preferences.macronutrientFocus.includes(macro.name)" 
                :icon="checkmarkOutline"
                slot="start"
              ></ion-icon>
              <span class="macro-emoji">{{ macro.emoji }}</span>
              <ion-label>{{ macro.name }}</ion-label>
            </ion-chip>
          </div>
        </div>
      </div>

      <!-- Generate Buttons -->
      <div v-if="ingredients.length > 0" class="generate-section">
        <ion-button 
          expand="block" 
          size="large"
          class="generate-button primary-button"
          @click="generateRecipe"
          :disabled="isGenerating"
        >
          <ion-icon v-if="!isGenerating" :icon="sparklesOutline" slot="start"></ion-icon>
          <ion-spinner v-else name="crescent" slot="start"></ion-spinner>
          {{ isGenerating ? 'Cooking up something amazing...' : '✨ Generate Recipe!' }}
        </ion-button>

        <ion-button 
          expand="block" 
          fill="outline" 
          size="large"
          class="generate-button secondary-button"
          @click="generateMultipleRecipes"
          :disabled="isGenerating || ingredients.length < 2"
        >
          <ion-icon v-if="!isGenerating" :icon="optionsOutline" slot="start"></ion-icon>
          <ion-spinner v-else name="crescent" slot="start"></ion-spinner>
          {{ isGenerating ? 'Generating options...' : '🎯 Get 3 Recipe Options' }}
        </ion-button>
      </div>

      <!-- Error Display -->
      <ion-item v-if="error" class="error-item" color="danger">
        <ion-icon :icon="alertCircleOutline" slot="start"></ion-icon>
        <ion-label class="ion-text-wrap">{{ error }}</ion-label>
        <ion-button fill="clear" slot="end" @click="clearError">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-item>

      <!-- Quick Start Suggestions -->
      <div v-if="ingredients.length === 0" class="quick-start-section">
        <div class="quick-start-header">
          <ion-icon :icon="bulbOutline" color="warning"></ion-icon>
          <h4>Need inspiration? Try these popular combinations:</h4>
        </div>
        <div class="suggestion-grid">
          <div 
            v-for="suggestion in quickStartSuggestions" 
            :key="suggestion.name"
            class="suggestion-card"
            @click="loadSuggestion(suggestion.ingredients)"
          >
            <div class="suggestion-icon">{{ suggestion.emoji }}</div>
            <h5>{{ suggestion.name }}</h5>
            <p>{{ suggestion.ingredients.join(', ') }}</p>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  toastController
} from '@ionic/vue';

import {
  restaurantOutline,
  addOutline,
  addCircleOutline,
  closeOutline,
  sparklesOutline,
  optionsOutline,
  checkmarkOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  bulbOutline,
  globeOutline,
  timeOutline,
  barChartOutline,
  peopleOutline,
  leafOutline,
  nutritionOutline
} from 'ionicons/icons';

import { useRecipes } from '@/composables/useRecipes';
import type { RecipeRequest } from '@/services/openai';

// Recipe management
const { 
  generateSingleRecipe, 
  generateRecipeOptions, 
  isGenerating, 
  error, 
  clearError 
} = useRecipes();

// Component state
const newIngredient = ref('');
const ingredients = ref<string[]>([]);

const preferences = reactive({
  cuisine: '',
  cookingTime: '',
  difficulty: '',
  servings: 4,
  dietaryRestrictions: [] as string[],
  macronutrientFocus: [] as string[]
});

const availableRestrictions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'
];

const availableMacros = [
  { name: 'Protein', emoji: '🥩' },
  { name: 'Carbs', emoji: '🍞' },
  { name: 'Fat', emoji: '🥑' }
];

const quickStartSuggestions = [
  { 
    name: 'Pasta Night', 
    emoji: '🍝',
    ingredients: ['pasta', 'tomatoes', 'garlic', 'olive oil'] 
  },
  { 
    name: 'Chicken Dinner', 
    emoji: '🍗',
    ingredients: ['chicken breast', 'onion', 'bell pepper', 'rice'] 
  },
  { 
    name: 'Veggie Stir-fry', 
    emoji: '🥬',
    ingredients: ['broccoli', 'carrots', 'soy sauce', 'ginger'] 
  },
  { 
    name: 'Breakfast Special', 
    emoji: '🍳',
    ingredients: ['eggs', 'cheese', 'spinach', 'bread'] 
  }
];

// Methods
const addIngredient = () => {
  const ingredient = newIngredient.value.trim();
  if (ingredient && !ingredients.value.includes(ingredient.toLowerCase())) {
    ingredients.value.push(ingredient.toLowerCase());
    newIngredient.value = '';
  }
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const toggleDietaryRestriction = (restriction: string) => {
  const index = preferences.dietaryRestrictions.indexOf(restriction);
  if (index > -1) {
    preferences.dietaryRestrictions.splice(index, 1);
  } else {
    preferences.dietaryRestrictions.push(restriction);
  }
};

const toggleMacronutrientFocus = (macro: string) => {
  const index = preferences.macronutrientFocus.indexOf(macro);
  if (index > -1) {
    preferences.macronutrientFocus.splice(index, 1);
  } else {
    preferences.macronutrientFocus.push(macro);
  }
};

const loadSuggestion = (suggestionIngredients: string[]) => {
  ingredients.value = [...suggestionIngredients];
};

const createRecipeRequest = (): RecipeRequest => {
  return {
    ingredients: ingredients.value,
    cuisinePreference: preferences.cuisine || undefined,
    cookingTime: preferences.cookingTime || undefined,
    difficulty: preferences.difficulty || undefined,
    servings: preferences.servings,
    dietaryRestrictions: preferences.dietaryRestrictions.length > 0 
      ? preferences.dietaryRestrictions 
      : undefined,
    macronutrientFocus: preferences.macronutrientFocus.length > 0 
      ? preferences.macronutrientFocus 
      : undefined
  };
};

const generateRecipe = async () => {
  if (ingredients.value.length === 0) return;

  const request = createRecipeRequest();
  const recipe = await generateSingleRecipe(request);
  
  if (recipe) {
    await showSuccessToast(`Recipe "${recipe.name}" generated successfully!`);
    emit('recipeGenerated', recipe);
  }
};

const generateMultipleRecipes = async () => {
  if (ingredients.value.length < 2) return;

  const request = createRecipeRequest();
  const recipes = await generateRecipeOptions(request, 3);
  
  if (recipes.length > 0) {
    await showSuccessToast(`${recipes.length} recipe options generated!`);
    emit('recipesGenerated', recipes);
  }
};

const showSuccessToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 3000,
    position: 'bottom',
    color: 'success'
  });
  await toast.present();
};

// Emit events
const emit = defineEmits<{
  recipeGenerated: [recipe: any];
  recipesGenerated: [recipes: any[]];
}>();
</script>

<style scoped>
.fridge-generator-card {
  margin: 16px;
  overflow: hidden;
  background: var(--card-gradient);
}

/* Header with gradient background */
.card-header-gradient {
  background: var(--food-gradient-warm);
  color: white;
  padding-bottom: 8px;
}

.main-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.6em;
  font-weight: 700;
  margin-bottom: 8px;
}

.title-icon {
  font-size: 1.3em;
}

.main-subtitle {
  font-size: 1.1em;
  opacity: 0.95;
  line-height: 1.4;
}

.main-content {
  padding: 24px 20px;
}

/* Ingredient Input Section */
.ingredient-input-section {
  margin-bottom: 24px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.input-container {
  position: relative;
}

.ingredient-input {
  --background: rgba(255, 255, 255, 0.9);
  --border-radius: 16px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  --padding-start: 16px;
  --padding-end: 60px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.ingredient-input:focus-within {
  --border-color: var(--ion-color-primary);
  transform: translateY(-2px);
  --box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.custom-input {
  font-size: 1.1em;
}

.add-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  --border-radius: 50%;
}

/* Ingredients Display */
.ingredients-display {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(82, 183, 136, 0.1) 0%, rgba(45, 80, 22, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(82, 183, 136, 0.2);
}

.ingredients-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.ingredients-header h4 {
  margin: 0;
  color: var(--ion-color-success);
  font-weight: 600;
}

.ingredients-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-chip {
  cursor: pointer;
  transition: all 0.3s ease;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-chip:hover {
  transform: scale(1.05);
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.remove-icon {
  font-size: 0.9em;
  margin-left: 4px;
  opacity: 0.7;
}

/* Preferences Section */
.preferences-section {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 214, 10, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(255, 214, 10, 0.2);
}

.preferences-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.preferences-header h4 {
  margin: 0;
  color: var(--ion-color-tertiary);
  font-weight: 600;
}

.preferences-grid {
  display: grid;
  gap: 12px;
}

.preference-item {
  --background: rgba(255, 255, 255, 0.8);
  --border-radius: 12px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 0;
  transition: all 0.3s ease;
}

.preference-item:hover {
  --background: rgba(255, 255, 255, 0.95);
  transform: translateX(4px);
}

/* Dietary Section */
.dietary-section {
  margin-top: 20px;
}

.dietary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dietary-header h5 {
  margin: 0;
  color: var(--ion-color-success);
  font-weight: 600;
}

.dietary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dietary-chip {
  cursor: pointer;
  transition: all 0.3s ease;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dietary-chip:hover {
  transform: scale(1.05);
}

/* Macronutrient Section */
.macro-section {
  margin-top: 20px;
}

.macro-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.macro-header h5 {
  margin: 0;
  color: var(--ion-color-primary);
  font-weight: 600;
}

.macro-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.macro-chip {
  cursor: pointer;
  transition: all 0.3s ease;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
}

.macro-chip:hover {
  transform: scale(1.05);
}

.macro-emoji {
  font-size: 1.1em;
  margin-right: 4px;
}

/* Generate Section */
.generate-section {
  margin: 32px 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.generate-button {
  --border-radius: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  font-size: 1.1em;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.primary-button {
  --background: var(--food-gradient-warm);
  --box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
}

.primary-button:hover {
  transform: translateY(-3px);
  --box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.secondary-button {
  --border-color: var(--ion-color-primary);
  --color: var(--ion-color-primary);
  --box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
}

.secondary-button:hover {
  transform: translateY(-2px);
  --background: rgba(255, 107, 53, 0.05);
}

/* Error Display */
.error-item {
  margin: 16px 0;
  --border-radius: 12px;
}

/* Quick Start Section */
.quick-start-section {
  text-align: center;
  margin-top: 24px;
}

.quick-start-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.quick-start-header h4 {
  margin: 0;
  color: var(--ion-color-warning);
  font-weight: 600;
}

.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.suggestion-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(255, 214, 10, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--ion-color-tertiary);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.suggestion-icon {
  font-size: 2em;
  margin-bottom: 6px;
}

.suggestion-card h5 {
  margin: 0 0 6px 0;
  font-weight: 600;
  color: var(--ion-color-dark);
  font-size: 0.9em;
}

.suggestion-card p {
  margin: 0;
  font-size: 0.8em;
  color: var(--ion-color-medium);
  line-height: 1.2;
}

/* Responsive Design */
@media (min-width: 768px) {
  .preferences-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .generate-section {
    flex-direction: row;
  }
  
  .generate-button {
    flex: 1;
  }
}

@media (min-width: 1024px) {
  .suggestion-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 