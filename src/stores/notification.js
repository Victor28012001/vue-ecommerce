import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('')

  const show = (msg, notificationType) => {
    message.value = msg
    type.value = notificationType
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 2000) // Increased duration to 2 seconds for better visibility
  }

  return { isVisible, message, show, type }
})