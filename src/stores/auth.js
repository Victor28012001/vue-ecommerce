// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(!!(localStorage.getItem('token') || getCookie('token')))

  function setLoggedIn(value) {
    isLoggedIn.value = value
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return { isLoggedIn, setLoggedIn }
})
