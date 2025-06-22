<template>
  <ion-card class="recipe-card">
    <div class="recipe-card-header">
      <div class="recipe-header-content">
        <div class="recipe-title-section">
          <ion-card-title class="recipe-title">{{ recipe.name }}</ion-card-title>
          <ion-card-subtitle class="recipe-subtitle">{{ recipe.description }}</ion-card-subtitle>
        </div>
        <ion-button 
          fill="clear" 
          :color="isInFavorites(recipe.name) ? 'danger' : 'medium'"
          @click="toggleFavorite"
          class="favorite-button"
        >
          <ion-icon :icon="isInFavorites(recipe.name) ? heart : heartOutline" class="favorite-icon"></ion-icon>
        </ion-button>
      </div>
    </div>

    <ion-card-content class="recipe-content">
      <!-- Recipe Info -->
      <div class="recipe-info">
        <div class="info-item">
          <div class="info-icon-container time">
            <ion-icon :icon="timeOutline"></ion-icon>
          </div>
          <div class="info-text">
            <span class="info-value">{{ recipe.cookingTime }}</span>
            <span class="info-label">Cook Time</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon-container difficulty">
            <ion-icon :icon="barChartOutline"></ion-icon>
          </div>
          <div class="info-text">
            <span class="info-value">{{ recipe.difficulty }}</span>
            <span class="info-label">Difficulty</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon-container servings">
            <ion-icon :icon="peopleOutline"></ion-icon>
          </div>
          <div class="info-text">
            <span class="info-value">{{ recipe.servings }}</span>
            <span class="info-label">Serving{{ recipe.servings > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="completedSteps.length > 0" class="progress-section">
        <div class="progress-header">
          <span class="progress-text">Progress: {{ progressPercentage }}%</span>
          <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <!-- Ingredients Section -->
      <div class="recipe-section">
        <div class="section-header">
          <div class="section-title-container">
            <ion-icon :icon="listOutline" color="primary"></ion-icon>
            <h3>Ingredients</h3>
          </div>
          <ion-chip color="primary" class="count-chip">
            {{ recipe.ingredients.length }} items
          </ion-chip>
        </div>
        <div class="ingredients-grid">
          <div 
            v-for="(ingredient, index) in recipe.ingredients" 
            :key="index"
            class="ingredient-item"
            :class="{ 'checked': checkedIngredients.includes(index) }"
            @click="toggleIngredientCheck(index)"
          >
            <ion-checkbox 
              :checked="checkedIngredients.includes(index)"
              @ionChange="toggleIngredientCheck(index)"
              class="ingredient-checkbox"
            ></ion-checkbox>
            <span class="ingredient-text">{{ ingredient }}</span>
          </div>
        </div>
      </div>

      <!-- Instructions Section -->
      <div class="recipe-section">
        <div class="section-header">
          <div class="section-title-container">
            <ion-icon :icon="receiptOutline" color="secondary"></ion-icon>
            <h3>Instructions</h3>
          </div>
          <ion-chip color="secondary" class="count-chip">
            {{ recipe.instructions.length }} steps
          </ion-chip>
        </div>
        <div class="instructions-list">
          <div 
            v-for="(instruction, index) in recipe.instructions" 
            :key="index"
            class="instruction-item"
            :class="{ 'completed': completedSteps.includes(index) }"
            @click="toggleStepCompletion(index)"
          >
            <div class="step-number" :class="{ 'completed': completedSteps.includes(index) }">
              {{ index + 1 }}
            </div>
            <div class="step-content">{{ instruction }}</div>
            <ion-icon 
              v-if="completedSteps.includes(index)" 
              :icon="checkmarkCircleOutline" 
              color="success"
              class="step-check"
            ></ion-icon>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div v-if="recipe.tips && recipe.tips.length > 0" class="recipe-section">
        <div class="section-header">
          <div class="section-title-container">
            <ion-icon :icon="bulbOutline" color="warning"></ion-icon>
            <h3>Chef's Tips</h3>
          </div>
          <ion-chip color="warning" class="count-chip">
            {{ recipe.tips.length }} tips
          </ion-chip>
        </div>
        <div class="tips-grid">
          <div v-for="(tip, index) in recipe.tips" :key="index" class="tip-item">
            <ion-icon :icon="sparklesOutline" color="warning" class="tip-icon"></ion-icon>
            <span class="tip-text">{{ tip }}</span>
          </div>
        </div>
      </div>

      <!-- Nutrition Highlights -->
      <div v-if="recipe.nutritionHighlights && recipe.nutritionHighlights.length > 0" class="recipe-section">
        <div class="section-header">
          <div class="section-title-container">
            <ion-icon :icon="fitnessOutline" color="success"></ion-icon>
            <h3>Nutrition Highlights</h3>
          </div>
        </div>
        <div class="nutrition-chips">
          <ion-chip 
            v-for="(highlight, index) in recipe.nutritionHighlights" 
            :key="index"
            color="success"
            class="nutrition-chip"
          >
            <ion-icon :icon="leafOutline" slot="start"></ion-icon>
            <ion-label>{{ highlight }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <ion-button 
          expand="block" 
          size="large"
          class="action-button primary-action"
          @click="startCooking"
        >
          <ion-icon :icon="playCircleOutline" slot="start"></ion-icon>
          Start Cooking Mode
        </ion-button>
        
        <div class="secondary-actions">
          <ion-button 
            fill="outline" 
            size="default"
            class="action-button secondary-action"
            @click="shareRecipe"
          >
            <ion-icon :icon="shareOutline" slot="start"></ion-icon>
            Share
          </ion-button>
          
          <ion-button 
            fill="clear" 
            size="default"
            class="action-button secondary-action"
            @click="copyRecipe"
          >
            <ion-icon :icon="copyOutline" slot="start"></ion-icon>
            Copy
          </ion-button>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonLabel,
  IonCheckbox,
  IonChip,
  toastController,
  actionSheetController
} from '@ionic/vue';

import {
  heart,
  heartOutline,
  timeOutline,
  barChartOutline,
  peopleOutline,
  listOutline,
  receiptOutline,
  checkmarkCircleOutline,
  bulbOutline,
  sparklesOutline,
  fitnessOutline,
  leafOutline,
  shareOutline,
  playCircleOutline,
  copyOutline
} from 'ionicons/icons';

import { useRecipes } from '@/composables/useRecipes';
import type { Recipe } from '@/services/openai';

// Props
interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();

// Recipe management
const { addToFavorites, removeFromFavorites, isInFavorites } = useRecipes();

// Component state
const completedSteps = ref<number[]>([]);
const checkedIngredients = ref<number[]>([]);

// Computed
const progressPercentage = computed(() => {
  if (props.recipe.instructions.length === 0) return 0;
  return Math.round((completedSteps.value.length / props.recipe.instructions.length) * 100);
});

// Methods
const toggleFavorite = async () => {
  if (isInFavorites(props.recipe.name)) {
    const success = await removeFromFavorites(props.recipe.name);
    if (success) {
      await showToast('Removed from favorites', 'medium');
    }
  } else {
    const success = await addToFavorites(props.recipe);
    if (success) {
      await showToast('Added to favorites!', 'success');
    }
  }
};

const toggleStepCompletion = (stepIndex: number) => {
  const index = completedSteps.value.indexOf(stepIndex);
  if (index > -1) {
    completedSteps.value.splice(index, 1);
  } else {
    completedSteps.value.push(stepIndex);
  }
};

const toggleIngredientCheck = (ingredientIndex: number) => {
  const index = checkedIngredients.value.indexOf(ingredientIndex);
  if (index > -1) {
    checkedIngredients.value.splice(index, 1);
  } else {
    checkedIngredients.value.push(ingredientIndex);
  }
};

const shareRecipe = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Share Recipe',
    buttons: [
      {
        text: 'Copy Recipe Text',
        icon: 'copy-outline',
        handler: () => {
          copyRecipeText();
        }
      },
      {
        text: 'Share via Native Share',
        icon: 'share-outline',
        handler: () => {
          shareViaNative();
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }
    ]
  });
  await actionSheet.present();
};

const copyRecipe = async () => {
  await copyRecipeText();
};

const copyRecipeText = async () => {
  const recipeText = formatRecipeForSharing();
  try {
    await navigator.clipboard.writeText(recipeText);
    await showToast('Recipe copied to clipboard!', 'success');
  } catch (error) {
    console.error('Failed to copy recipe:', error);
    await showToast('Failed to copy recipe', 'danger');
  }
};

const shareViaNative = async () => {
  const recipeText = formatRecipeForSharing();
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.recipe.name,
        text: recipeText,
      });
    } else {
      await copyRecipeText();
    }
  } catch (error) {
    console.error('Failed to share recipe:', error);
  }
};

const formatRecipeForSharing = (): string => {
  let text = `🍳 ${props.recipe.name}\n\n`;
  text += `${props.recipe.description}\n\n`;
  text += `⏱️ Cooking Time: ${props.recipe.cookingTime}\n`;
  text += `📊 Difficulty: ${props.recipe.difficulty}\n`;
  text += `👥 Servings: ${props.recipe.servings}\n\n`;
  
  text += `📝 INGREDIENTS:\n`;
  props.recipe.ingredients.forEach((ingredient, index) => {
    text += `${index + 1}. ${ingredient}\n`;
  });
  
  text += `\n🔥 INSTRUCTIONS:\n`;
  props.recipe.instructions.forEach((instruction, index) => {
    text += `${index + 1}. ${instruction}\n`;
  });
  
  if (props.recipe.tips && props.recipe.tips.length > 0) {
    text += `\n💡 CHEF'S TIPS:\n`;
    props.recipe.tips.forEach((tip, index) => {
      text += `• ${tip}\n`;
    });
  }
  
  text += `\n🍽️ Created with WhatchaCookin App`;
  return text;
};

const startCooking = async () => {
  // Reset progress
  completedSteps.value = [];
  checkedIngredients.value = [];
  
  await showToast('Cooking mode started! Check off ingredients and steps as you go.', 'primary');
  
  // Emit event to parent to enter cooking mode
  emit('startCookingMode', props.recipe);
};

const showToast = async (message: string, color: string = 'success') => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: 'bottom',
    color
  });
  await toast.present();
};

// Emit events
const emit = defineEmits<{
  startCookingMode: [recipe: Recipe];
}>();
</script>

<style scoped>
.recipe-card {
  margin: 16px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--card-gradient);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

/* Header */
.recipe-card-header {
  background: var(--food-gradient-warm);
  color: white;
  padding: 20px;
}

.recipe-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.recipe-title-section {
  flex: 1;
}

.recipe-title {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

.recipe-subtitle {
  font-size: 1em;
  opacity: 0.9;
  line-height: 1.4;
}

.favorite-button {
  --border-radius: 50%;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  transition: all 0.3s ease;
}

.favorite-button:hover {
  transform: scale(1.1);
}

.favorite-icon {
  font-size: 1.5em;
}

/* Content */
.recipe-content {
  padding: 24px 20px;
}

/* Recipe Info */
.recipe-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.8) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.info-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.info-icon-container.time {
  background: var(--food-gradient-warm);
}

.info-icon-container.difficulty {
  background: var(--food-gradient-fresh);
}

.info-icon-container.servings {
  background: var(--food-gradient-sunny);
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-value {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.info-label {
  font-size: 0.8em;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Progress Section */
.progress-section {
  margin-bottom: 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(82, 183, 136, 0.1) 0%, rgba(45, 80, 22, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(82, 183, 136, 0.2);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-weight: 600;
  color: var(--ion-color-success);
}

.progress-bar {
  height: 8px;
  background: rgba(82, 183, 136, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--food-gradient-fresh);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Recipe Sections */
.recipe-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title-container h3 {
  margin: 0;
  font-size: 1.3em;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.count-chip {
  font-size: 0.8em;
  font-weight: 600;
}

/* Ingredients */
.ingredients-grid {
  display: grid;
  gap: 8px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

.ingredient-item.checked {
  background: rgba(82, 183, 136, 0.1);
  border-color: var(--ion-color-success);
}

.ingredient-checkbox {
  --size: 20px;
}

.ingredient-text {
  flex: 1;
  font-size: 1em;
  line-height: 1.4;
}

.ingredient-item.checked .ingredient-text {
  text-decoration: line-through;
  opacity: 0.7;
}

/* Instructions */
.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.instruction-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.instruction-item.completed {
  background: rgba(82, 183, 136, 0.1);
  border-color: var(--ion-color-success);
}

.step-number {
  background: var(--ion-color-primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: bold;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-number.completed {
  background: var(--ion-color-success);
}

.step-content {
  flex: 1;
  line-height: 1.5;
  font-size: 1em;
}

.step-check {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.4em;
}

/* Tips */
.tips-grid {
  display: grid;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(247, 127, 0, 0.1) 0%, rgba(255, 214, 10, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(247, 127, 0, 0.2);
}

.tip-icon {
  font-size: 1.2em;
  margin-top: 2px;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  line-height: 1.4;
  font-style: italic;
}

/* Nutrition */
.nutrition-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nutrition-chip {
  transition: all 0.3s ease;
}

.nutrition-chip:hover {
  transform: scale(1.05);
}

/* Action Buttons */
.action-buttons {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-button {
  --border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.primary-action {
  --background: var(--food-gradient-warm);
  --color: white;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-size: 1.1em;
  --box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
}

.primary-action:hover {
  transform: translateY(-3px);
  --box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.secondary-actions {
  display: flex;
  gap: 12px;
}

.secondary-action {
  flex: 1;
  --border-color: var(--ion-color-primary);
  --color: var(--ion-color-primary);
}

.secondary-action:hover {
  transform: translateY(-2px);
  --background: rgba(255, 107, 53, 0.05);
}

/* Responsive Design */
@media (max-width: 480px) {
  .recipe-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item {
    justify-content: center;
    text-align: center;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    align-items: center;
  }
  
  .primary-action {
    flex: 2;
  }
  
  .secondary-actions {
    flex: 1;
  }
}
</style> 