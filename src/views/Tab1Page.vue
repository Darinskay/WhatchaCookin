<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>WhatchaCookin</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">WhatchaCookin</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Welcome Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Welcome to WhatchaCookin!</ion-card-title>
          <ion-card-subtitle>Discover amazing recipes</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          Find and share your favorite recipes with our cooking community.
        </ion-card-content>
      </ion-card>

      <!-- Search Section -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Search Recipes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-searchbar 
            v-model="searchTerm" 
            placeholder="Search for recipes..."
            @ionInput="handleSearch">
          </ion-searchbar>
          
          <ion-chip v-for="tag in popularTags" :key="tag" color="secondary">
            <ion-label>{{ tag }}</ion-label>
          </ion-chip>
        </ion-card-content>
      </ion-card>

      <!-- Action Buttons -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Quick Actions</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-button expand="block" color="primary" @click="addRecipe">
            <ion-icon :icon="addOutline" slot="start"></ion-icon>
            Add New Recipe
          </ion-button>
          
          <ion-button expand="block" fill="outline" color="secondary" @click="viewFavorites">
            <ion-icon :icon="heartOutline" slot="start"></ion-icon>
            My Favorites
          </ion-button>
          
          <ion-button expand="block" fill="clear" color="tertiary" @click="randomRecipe">
            <ion-icon :icon="shuffleOutline" slot="start"></ion-icon>
            Random Recipe
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Recipe Categories -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Categories</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="category in categories" :key="category.name" button @click="selectCategory(category)">
              <ion-icon :icon="category.icon" slot="start" :color="category.color"></ion-icon>
              <ion-label>
                <h2>{{ category.name }}</h2>
                <p>{{ category.count }} recipes</p>
              </ion-label>
              <ion-badge color="light" slot="end">{{ category.count }}</ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Settings Toggle -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Preferences</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-checkbox v-model="notifications" slot="start"></ion-checkbox>
            <ion-label>Push Notifications</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-toggle v-model="darkMode" slot="end"></ion-toggle>
            <ion-label>Dark Mode</ion-label>
          </ion-item>
          
          <ion-item>
            <ion-label>Difficulty Level</ion-label>
            <ion-select v-model="difficultyLevel" placeholder="Select Level">
              <ion-select-option value="beginner">Beginner</ion-select-option>
              <ion-select-option value="intermediate">Intermediate</ion-select-option>
              <ion-select-option value="advanced">Advanced</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Loading and Alert Examples -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Interactions</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-button expand="block" fill="outline" @click="showAlert">
            <ion-icon :icon="informationCircleOutline" slot="start"></ion-icon>
            Show Alert
          </ion-button>
          
          <ion-button expand="block" fill="outline" @click="showLoading">
            <ion-icon :icon="hourglassOutline" slot="start"></ion-icon>
            Show Loading
          </ion-button>
          
          <ion-button expand="block" fill="outline" @click="showToast">
            <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
            Show Toast
          </ion-button>
        </ion-card-content>
      </ion-card>

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
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonBadge,
  IonCheckbox,
  IonToggle,
  IonSelect,
  IonSelectOption,
  alertController,
  loadingController,
  toastController
} from '@ionic/vue';

import {
  settingsOutline,
  addOutline,
  heartOutline,
  shuffleOutline,
  restaurantOutline,
  pizzaOutline,
  cafeOutline,
  leafOutline,
  informationCircleOutline,
  hourglassOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

// Reactive data
const searchTerm = ref('');
const notifications = ref(true);
const darkMode = ref(false);
const difficultyLevel = ref('beginner');

const popularTags = ref(['Italian', 'Vegetarian', 'Quick', 'Healthy', 'Dessert']);

const categories = ref([
  { name: 'Main Dishes', count: 25, icon: restaurantOutline, color: 'primary' },
  { name: 'Pizza & Pasta', count: 18, icon: pizzaOutline, color: 'secondary' },
  { name: 'Beverages', count: 12, icon: cafeOutline, color: 'tertiary' },
  { name: 'Vegetarian', count: 22, icon: leafOutline, color: 'success' }
]);

// Methods
const handleSearch = (event: any) => {
  console.log('Searching for:', event.target.value);
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

const showAlert = async () => {
  const alert = await alertController.create({
    header: 'Recipe Alert',
    subHeader: 'New Recipe Available!',
    message: 'A delicious new pasta recipe has been added to your favorites.',
    buttons: ['OK']
  });
  await alert.present();
};

const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Loading recipes...',
    duration: 2000
  });
  await loading.present();
};

const showToast = async () => {
  const toast = await toastController.create({
    message: 'Recipe saved to favorites!',
    duration: 2000,
    position: 'bottom',
    color: 'success'
  });
  await toast.present();
};
</script>

<style scoped>
ion-card {
  margin: 16px;
}

ion-chip {
  margin: 4px;
}

ion-button {
  margin: 8px 0;
}
</style>
