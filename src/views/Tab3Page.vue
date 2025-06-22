<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Account</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-content">
          <ion-spinner name="crescent" class="pulse-animation"></ion-spinner>
          <p class="loading-text">Loading your account...</p>
        </div>
      </div>

      <!-- Authentication Required -->
      <div v-else-if="!isAuthenticated" class="auth-required">
        <ion-card class="auth-card">
          <ion-card-content>
            <div class="auth-message">
              <ion-icon :icon="personCircleOutline" class="auth-icon"></ion-icon>
              <h2>Sign In Required</h2>
              <p>Please sign in to view your account details and preferences.</p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- User Profile Section -->
      <div v-else class="account-content">
        <div class="profile-section fade-in-up">
          <UserProfile />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue';

import {
  personCircleOutline
} from 'ionicons/icons';

import { useSupabase } from '@/composables/useSupabase';
import UserProfile from '@/components/UserProfile.vue';

// Supabase integration
const { loading, isAuthenticated } = useSupabase();
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

/* Account Content */
.account-content {
  padding: 8px;
}

.profile-section {
  margin-bottom: 24px;
}

/* Responsive Design */
@media (min-width: 768px) {
  .account-content {
    padding: 16px 24px;
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
