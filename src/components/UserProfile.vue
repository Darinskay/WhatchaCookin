<template>
  <ion-card v-if="user">
    <ion-card-header>
      <ion-card-title>User Profile</ion-card-title>
    </ion-card-header>
    
    <ion-card-content>
      <ion-item>
        <ion-label>
          <h3>Email</h3>
          <p>{{ user.email }}</p>
        </ion-label>
      </ion-item>
      
      <ion-item>
        <ion-label>
          <h3>User ID</h3>
          <p>{{ user.id }}</p>
        </ion-label>
      </ion-item>
      
      <ion-item>
        <ion-label>
          <h3>Created At</h3>
          <p>{{ formatDate(user.created_at) }}</p>
        </ion-label>
      </ion-item>
      
      <ion-item>
        <ion-label>
          <h3>Last Sign In</h3>
          <p>{{ formatDate(user.last_sign_in_at) }}</p>
        </ion-label>
      </ion-item>
      
      <ion-button
        expand="block"
        fill="outline"
        color="danger"
        @click="handleSignOut"
        :disabled="loading"
        class="ion-margin-top"
      >
        <ion-spinner v-if="loading" name="crescent" size="small"></ion-spinner>
        <span v-else>Sign Out</span>
      </ion-button>
      
      <ion-toast
        :is-open="!!message"
        :message="message"
        color="danger"
        :duration="3000"
        @didDismiss="message = ''"
      ></ion-toast>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonToast
} from '@ionic/vue'
import { useSupabase } from '@/composables/useSupabase'

const { user, signOut } = useSupabase()

const loading = ref(false)
const message = ref('')

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const handleSignOut = async () => {
  loading.value = true
  
  try {
    const { error } = await signOut()
    if (error) {
      message.value = error.message
    }
  } catch (error) {
    message.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script> 