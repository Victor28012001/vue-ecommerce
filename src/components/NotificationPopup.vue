<template>
  <transition name="fade">
    <div v-if="store.isVisible" class="notification-popup" :style="store.type === 'error' ? { backgroundColor: '#f44336' } : { backgroundColor: '#4CAF50' }">
      {{ store.message }}
    </div>
  </transition>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification'

const store = useNotificationStore()
</script>

<style scoped>
.notification-popup {
  position: fixed;
  bottom: 50%;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-size: 14px;
  transform: translateY(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>