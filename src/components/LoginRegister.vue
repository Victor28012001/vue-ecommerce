<!-- <template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <input v-if="!isLogin" v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
      <div v-if="!isLogin && confirmPasswordError" class="input-error">{{ confirmPasswordError }}</div>

      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>

    <p @click="toggleMode" class="toggle">
      {{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }}
    </p>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // adjust path
import ModalMessage from './ModalMessage.vue'
const auth = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const router = useRouter()

const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('Error')
const modalType = ref('error') // or success, info, warning

function showError(message, type = 'error', title = 'Error') {
  modalMessage.value = message
  modalType.value = type
  modalTitle.value = title
  showModal.value = true
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  message.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleSubmit = async () => {
  message.value = ''

  if (!isLogin.value && password.value !== confirmPassword.value) {
    message.value = "Passwords don't match"
    return
  }

  try {
    if (isLogin.value) {
      await login()
    } else {
      await registerAndLogin()
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'An error occurred'
  }
}

async function fetchBasket() {
  try {
    const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    if (!token) throw new Error('No authentication token found');

    const res = await axios.get('https://api.defonix.com/api/basket/', {
      headers: {
        // 'Authorization': `Token ${token}`,
        'Accept': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch basket:', error);
    showError("Failed to fetch basket: " + error.message, 'error', 'Basket Error')
    message.value = error.response?.data?.detail || 'Failed to fetch basket';
  }
}


const login = async () => {
  try {

    const res = await axios.post('https://api.defonix.com/api/login/', {
      username: email.value,
      password: password.value,
    }
    );

    console.log('Login session response:', res.data);

    const tokenRes = await axios.post('https://api.defonix.com/api/auth-token/', {
      username: email.value,
      password: password.value,
    });

    const token = tokenRes.data.token;
    console.log('Token:', token);

    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;

    auth.setLoggedIn(true) // ✅ Set user as logged in


    // Now fetch the updated (owned) basket
    await fetchBasket();

    router.push('/dashboard');
  } catch (error) {
    showError("Login failed: " + error.message, 'error', 'Login Error')
    // console.error('Login failed:', error);
    message.value = error.response?.data?.detail || 'Login failed';
  }
};


const registerAndLogin = async () => {
  await axios.post('https://api.defonix.com/api/register/', {
    email: email.value,
    password1: password.value,
    password2: confirmPassword.value
  })

  // auto login after successful registration
  await login()
}

</script> -->
<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Email -->
      <input v-model="email" type="email" placeholder="Email" required />
      <div v-if="emailError" class="input-error">{{ emailError }}</div>

      <!-- Password -->
      <div class="input-with-icon">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required />
        <span class="icon-wrapper" @click="showPassword = !showPassword">
          <component :is="showPassword ? EyeOffIcon : EyeIcon" class="eye-icon" />
        </span>
      </div>
      <div v-if="passwordError" class="input-error">{{ passwordError }}</div>

      <!-- Confirm Password (Register only) -->
      <div v-if="!isLogin" class="input-with-icon">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
          placeholder="Confirm Password" required />
        <span class="icon-wrapper" @click="showConfirmPassword = !showConfirmPassword">
          <component :is="showConfirmPassword ? EyeOffIcon : EyeIcon" class="eye-icon" />
        </span>
      </div>
      <div v-if="!isLogin && confirmPasswordError" class="input-error">
        {{ confirmPasswordError }}
      </div>

      <!-- Submit Button -->
      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>

    <!-- Toggle Mode -->
    <p @click="toggleMode" class="toggle">
      {{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }}
    </p>

    <!-- Message -->
    <div v-if="message" class="message">{{ message }}</div>
  </div>

  <!-- Modal -->
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ModalMessage from './ModalMessage.vue'
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'

const auth = useAuthStore()
const router = useRouter()

// Auth state
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')

// Field-specific errors
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)


// Modal state
const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('Error')
const modalType = ref('error')

function showError(message, type = 'error', title = 'Error') {
  modalMessage.value = message
  modalType.value = type
  modalTitle.value = title
  showModal.value = true
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  message.value = ''
  password.value = ''
  confirmPassword.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
}

const handleSubmit = async () => {
  // Reset previous errors
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  message.value = ''

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  // Password validation
  if (password.value.length < 8 || password.value.length > 50) {
    passwordError.value = 'Password must be between 8 and 50 characters.'
    return
  }

  if (/^\d+$/.test(password.value)) {
    passwordError.value = 'Password cannot be all numbers.'
    return
  }

  // Confirm password validation (only on register)
  if (!isLogin.value) {
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = "Passwords don't match."
      return
    }
  }

  try {
    if (isLogin.value) {
      await login()
    } else {
      await registerAndLogin()
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'An error occurred'
  }
}

async function fetchBasket() {
  try {
    const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    if (!token) throw new Error('No authentication token found');

    const res = await axios.get('https://api.defonix.com/api/basket/', {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch basket:', error);
    showError("Failed to fetch basket: " + error.message, 'error', 'Basket Error')
    message.value = error.response?.data?.detail || 'Failed to fetch basket';
  }
}

const login = async () => {
  try {
    const res = await axios.post('https://api.defonix.com/api/login/', {
      username: email.value,
      password: password.value,
    })

    console.log('Login session response:', res.data)

    const tokenRes = await axios.post('https://api.defonix.com/api/auth-token/', {
      username: email.value,
      password: password.value,
    })

    const token = tokenRes.data.token
    console.log('Token:', token)

    localStorage.setItem('token', token)
    document.cookie = `token=${token}; path=/; secure; samesite=strict`

    auth.setLoggedIn(true)

    await fetchBasket()

    router.push('/dashboard')
  } catch (error) {
    const data = error.response?.data;

    if (data?.non_field_errors) {
      showError(data.non_field_errors.join(', '), 'error', 'Login Error');
    } else if (data?.detail) {
      showError(data.detail, 'error', 'Login Error');
    } else {
      showError("Login failed. Please try again.", 'error', 'Login Error');
    }

    message.value = data?.non_field_errors?.[0] || data?.detail || 'Login failed';
  }
}

const registerAndLogin = async () => {
  try {
    await axios.post('https://api.defonix.com/api/register/', {
      email: email.value,
      password1: password.value,
      password2: confirmPassword.value
    });

    await login(); // Auto-login if registration succeeds
  } catch (error) {
    const data = error.response?.data;

    if (data?.non_field_errors) {
      showError(data.non_field_errors.join(', '), 'error', 'Registration Error');
    } else if (data?.email) {
      emailError.value = data.email.join(', ');
    } else if (data?.password1) {
      passwordError.value = data.password1.join(', ');
    } else if (data?.password2) {
      confirmPasswordError.value = data.password2.join(', ');
    } else {
      showError("Registration failed. Please try again.", 'error', 'Registration Error');
    }
  }
};
</script>

<style scoped>
.auth-container {
  width: 400px;
  margin: 4.2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  background: #f9f9f9;
  max-width: 70%;
}

input {
  display: block;
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  height: 34px;
  font-size: 14px;
  padding: 0 16px;
  background-color: #053379;
  color: #fff;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  box-sizing: border-box;
}

.message {
  margin-top: 1rem;
  color: red;
}

.toggle {
  margin-top: 1rem;
  color: #007bff;
  cursor: pointer;
  user-select: none;
}

h2 {
  margin-bottom: 20px;
  color: #262525;
  font-size: 22px;
  text-align: left;
  background-color: #F9F9F9;
}

h2 {
  padding: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  border-top: none;
}

.input-error {
  color: red;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
}

.icon-wrapper {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280; /* Tailwind gray-500 */
}

</style>
