<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Explore</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Explore</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-content">
          <ion-spinner name="crescent" class="pulse-animation"></ion-spinner>
          <p class="loading-text">Loading content...</p>
        </div>
      </div>

      <!-- Authentication Required -->
      <div v-else-if="!isAuthenticated" class="auth-required">
        <ion-card class="auth-card">
          <ion-card-content>
            <div class="auth-message">
              <ion-icon :icon="lockClosedOutline" class="auth-icon"></ion-icon>
              <h2>Authentication Required</h2>
              <p>Please sign in to explore recipes and features.</p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Main Content -->
      <div v-else class="main-content">
        <!-- Quick Actions Section -->
        <div class="quick-actions-section fade-in-up">
          <div class="section-header">
            <h2 class="section-title">
              <ion-icon :icon="flashOutline" class="section-icon"></ion-icon>
              Quick Actions
            </h2>
          </div>
          
          <div class="action-grid">
            <ion-card class="action-card" button @click="addRecipe">
              <ion-card-content>
                <div class="action-icon-container primary">
                  <ion-icon :icon="addOutline" class="action-icon"></ion-icon>
                </div>
                <h3>Add Recipe</h3>
                <p>Create your own recipe</p>
              </ion-card-content>
            </ion-card>
            
            <ion-card class="action-card" button @click="viewFavorites">
              <ion-card-content>
                <div class="action-icon-container secondary">
                  <ion-icon :icon="heartOutline" class="action-icon"></ion-icon>
                </div>
                <h3>My Favorites</h3>
                <p>View saved recipes</p>
              </ion-card-content>
            </ion-card>
            
            <ion-card class="action-card" button @click="randomRecipe">
              <ion-card-content>
                <div class="action-icon-container tertiary">
                  <ion-icon :icon="shuffleOutline" class="action-icon"></ion-icon>
                </div>
                <h3>Random Recipe</h3>
                <p>Surprise me!</p>
              </ion-card-content>
            </ion-card>
          </div>
        </div>

        <!-- Search Section -->
        <ion-card class="search-card fade-in-up">
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="searchOutline" class="section-icon"></ion-icon>
              Discover Recipes
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-searchbar 
              v-model="searchTerm" 
              placeholder="Search for recipes, ingredients, cuisines..."
              @ionInput="handleSearch">
            </ion-searchbar>
            
            <div class="popular-tags">
              <p class="tags-label">Popular:</p>
              <ion-chip 
                v-for="tag in popularTags" 
                :key="tag" 
                color="tertiary"
                @click="searchByTag(tag)"
              >
                <ion-label>{{ tag }}</ion-label>
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Recipe Categories -->
        <div class="categories-section fade-in-up">
          <div class="section-header">
            <h2 class="section-title">
              <ion-icon :icon="gridOutline" class="section-icon"></ion-icon>
              Browse Categories
            </h2>
          </div>
          
          <div class="categories-grid">
            <ion-card 
              v-for="category in categories" 
              :key="category.name" 
              class="category-card" 
              button 
              @click="selectCategory(category)"
            >
              <ion-card-content>
                <div class="category-icon-container" :class="category.color">
                  <ion-icon :icon="category.icon" class="category-icon"></ion-icon>
                </div>
                <h3>{{ category.name }}</h3>
                <p>{{ category.count }} recipes</p>
                <ion-badge :color="category.color" class="category-badge">{{ category.count }}</ion-badge>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonBadge,
  IonSpinner
} from '@ionic/vue';

import {
  addOutline,
  heartOutline,
  shuffleOutline,
  restaurantOutline,
  pizzaOutline,
  cafeOutline,
  leafOutline,
  flashOutline,
  searchOutline,
  gridOutline,
  lockClosedOutline
} from 'ionicons/icons';

import { useSupabase } from '@/composables/useSupabase';

// Supabase integration
const { loading, isAuthenticated } = useSupabase();

// Reactive data
const searchTerm = ref('');

const popularTags = ref(['Italian', 'Vegetarian', 'Quick & Easy', 'Healthy', 'Desserts', 'Asian']);

const categories = ref([
  { name: 'Main Dishes', count: 25, icon: restaurantOutline, color: 'primary' },
  { name: 'Pizza & Pasta', count: 18, icon: pizzaOutline, color: 'secondary' },
  { name: 'Beverages', count: 12, icon: cafeOutline, color: 'warning' },
  { name: 'Vegetarian', count: 22, icon: leafOutline, color: 'success' }
]);

// Methods
const handleSearch = (event: any) => {
  console.log('Searching for:', event.target.value);
};

const searchByTag = (tag: string) => {
  searchTerm.value = tag;
  handleSearch({ target: { value: tag } });
};

const addRecipe = () => {
  console.log('Add new recipe clicked');
};

const viewFavorites = () => {
  console.log('View favorites clicked');
};

const randomRecipe = () => {
  console.log('Random recipe clicked');
};

const selectCategory = (category: any) => {
  console.log('Selected category:', category.name);
};
</script>

<style scoped>
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

/* Authentication Required */
.auth-required {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.auth-card {
  max-width: 400px;
  width: 100%;
}

.auth-message {
  text-align: center;
}

.auth-icon {
  font-size: 3em;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.auth-message h2 {
  color: var(--ion-color-dark);
  margin-bottom: 8px;
}

.auth-message p {
  color: var(--ion-color-medium);
}

/* Main Content Layout */
.main-content {
  padding: 8px;
}

.quick-actions-section,
.categories-section {
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

/* Quick Actions Grid */
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 0 16px;
}

.action-card {
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.action-icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  transition: all 0.3s ease;
}

.action-icon-container.primary {
  background: var(--food-gradient-warm);
}

.action-icon-container.secondary {
  background: var(--food-gradient-fresh);
}

.action-icon-container.tertiary {
  background: var(--food-gradient-sunny);
}

.action-icon {
  font-size: 1.8em;
  color: white;
}

.action-card h3 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--ion-color-dark);
}

.action-card p {
  font-size: 0.9em;
  color: var(--ion-color-medium);
  margin: 0;
}

/* Search Card */
.search-card {
  margin: 16px;
}

.popular-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tags-label {
  font-weight: 600;
  color: var(--ion-color-medium);
  margin: 0;
  min-width: fit-content;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 0 16px;
}

.category-card {
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-6px);
}

.category-icon-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}

.category-icon-container.primary {
  background: var(--ion-color-primary-tint);
}

.category-icon-container.secondary {
  background: var(--ion-color-secondary-tint);
}

.category-icon-container.warning {
  background: var(--ion-color-warning-tint);
}

.category-icon-container.success {
  background: var(--ion-color-success-tint);
}

.category-icon {
  font-size: 1.5em;
  color: white;
}

.category-card h3 {
  font-size: 1em;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--ion-color-dark);
}

.category-card p {
  font-size: 0.85em;
  color: var(--ion-color-medium);
  margin: 0 0 8px 0;
}

.category-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.7em;
}

/* Responsive Design */
@media (min-width: 768px) {
  .main-content {
    padding: 16px 24px;
  }
  
  .action-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
