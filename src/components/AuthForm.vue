<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ isLogin ? 'Sign In' : 'Sign Up' }}</ion-card-title>
    </ion-card-header>
    
    <ion-card-content>
      <form @submit.prevent="handleSubmit">
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            v-model="email"
            type="email"
            required
            :disabled="loading"
          ></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input
            v-model="password"
            type="password"
            required
            :disabled="loading"
          ></ion-input>
        </ion-item>
        
        <ion-button
          expand="block"
          type="submit"
          :disabled="loading || !email || !password"
          class="ion-margin-top"
        >
          <ion-spinner v-if="loading" name="crescent" size="small"></ion-spinner>
          <span v-else>{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
        </ion-button>
        
        <ion-button
          fill="clear"
          expand="block"
          @click="isLogin = !isLogin"
          :disabled="loading"
        >
          {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
        </ion-button>
        
        <ion-button
          v-if="isLogin"
          fill="clear"
          expand="block"
          @click="handleResetPassword"
          :disabled="loading || !email"
        >
          Reset Password
        </ion-button>
      </form>
      
      <ion-toast
        :is-open="!!message"
        :message="message"
        :color="messageType"
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
  IonInput,
  IonButton,
  IonSpinner,
  IonToast
} from '@ionic/vue'
import { useSupabase } from '@/composables/useSupabase'

const { signUp, signIn, resetPassword } = useSupabase()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'danger' | 'warning'>('success')

const showMessage = (msg: string, type: 'success' | 'danger' | 'warning' = 'success') => {
  message.value = msg
  messageType.value = type
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isLogin.value) {
      const { error } = await signIn(email.value, password.value)
      if (error) {
        showMessage(error.message, 'danger')
      } else {
        showMessage('Successfully signed in!', 'success')
      }
    } else {
      const { error } = await signUp(email.value, password.value)
      if (error) {
        showMessage(error.message, 'danger')
      } else {
        showMessage('Check your email for verification link!', 'success')
      }
    }
  } catch (error) {
    showMessage('An unexpected error occurred', 'danger')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!email.value) {
    showMessage('Please enter your email address', 'warning')
    return
  }
  
  loading.value = true
  
  try {
    const { error } = await resetPassword(email.value)
    if (error) {
      showMessage(error.message, 'danger')
    } else {
      showMessage('Password reset email sent!', 'success')
    }
  } catch (error) {
    showMessage('An unexpected error occurred', 'danger')
  } finally {
    loading.value = false
  }
}
</script> 