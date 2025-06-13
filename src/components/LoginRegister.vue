<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <!-- Only show confirm password for register -->
      <input v-if="!isLogin" v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>

    <p @click="toggleMode" class="toggle">
      {{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }}
    </p>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const router = useRouter()

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



// const login = async () => {
//   try {
//     // 1. Get CSRF token (must have visited the API server before to receive it)
//     const csrfToken = getCookie('csrftoken');

//     const res = await axios.post('https://api.defonix.com/api/login/', {
//       username: email.value,
//       password: password.value,
//     }, {
//       headers: {
//         'X-CSRFToken': csrfToken,
//         'Accept': 'application/json',
//       },
//     });

//     console.log('Login session response:', res.data);

//     const tokenRes = await axios.post('https://api.defonix.com/api/auth-token/', {
//       username: email.value,
//       password: password.value,
//     });

//     const token = tokenRes.data.token;
//     console.log('Token:', token);

//     localStorage.setItem('token', token);
//     document.cookie = `token=${token}; path=/; secure; samesite=strict`;

//     // Now fetch the updated (owned) basket
//     await fetchBasket();

//     router.push('/dashboard');
//   } catch (error) {
//     console.error('Login failed:', error);
//     message.value = error.response?.data?.detail || 'Login failed';
//   }
// };

const login = async () => {
  console.log('Attempting login with:', email.value, password.value);
  try {
    const res = await axios.post('https://api.defonix.com/api/auth-token/', {
      username: email.value,
      password: password.value,
    });

    const authToken = res.data.token;

    if (authToken) {
      localStorage.setItem('token', authToken);
      console.log('Token saved:', authToken);
      router.push('/dashboard');
    } else {
      console.warn('No token received from auth-token endpoint');
      message.value = 'Login failed: no token received';
    }
  } catch (error) {
    console.error('Login failed:', error);
    message.value = error.response?.data?.non_field_errors?.[0] || 'Login failed';
  }
};


const registerAndLogin = async () => {
  await axios.post('https://api.defonix.com/api/register/', {
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  })

  // auto login after successful registration
  await login()
}

//function getCookie(name) {
  //const value = `; ${document.cookie}`;
  //const parts = value.split(`; ${name}=`);
  //if (parts.length === 2) return parts.pop().split(';').shift();
//}

</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  background: #f9f9f9;
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
</style>
