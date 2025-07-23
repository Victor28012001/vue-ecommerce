<template>
  <header class="header-wrapper">
    <div class="top-row">
      <div class="logo-wrapper">
        <div class="logo">
          <router-link to="/" class="router-link links">
            <img src="/images/logo.jpg" alt="" width="80">
          </router-link>
        </div>
        <div class="search-bar1" style="position: relative;">
          <input v-model="searchQuery" @input="onSearchInput" @focus="onSearchInput" @blur="hideSuggestionsWithDelay"
            placeholder="Search for products, brands.." class="input" name="search" type="text" autocomplete="off" />
          <button class="button1" @click="onSearchInput">Search</button>

          <ul v-if="showSuggestions && filteredResults.length" class="suggestions">
            <li v-for="product in filteredResults" :key="product.id" @mousedown.prevent="goToProduct(product.id)"
              class="suggestion-item">
              {{ product.title || 'Unnamed Product' }}
            </li>
          </ul>
        </div>
      </div>

      <div class="end">
        <template v-if="auth.isLoggedIn">
          <router-link to="/dashboard" class="router-link links">
            <span>Profile</span>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/loginRegister" class="router-link links">
            <span>Login</span>
          </router-link>
        </template>
        <router-link to="/wishlist" class="router-link links">
          <HeartIcon class="icon" />
          <span>Wishlist</span>
        </router-link>
        <div class="router-link links" @click="isCartOpen = true" id="cart">
          <ShoppingCartIcon class="icon" />
          <span>Cart</span>
          <span id="count">{{ cartItems.length }}</span>
        </div>
      </div>
    </div>

    <div class="search-row">
      <div class="search-bar" style="position: relative;">
        <input v-model="searchQuery" @input="onSearchInput" @focus="onSearchInput" @blur="hideSuggestionsWithDelay"
          placeholder="Search for products, brands.." class="input" name="search" type="text" autocomplete="off" />
        <button class="button1" @click="onSearchInput">Search</button>

        <ul v-if="showSuggestions && filteredResults.length" class="suggestions">
          <li v-for="product in filteredResults" :key="product.id" @mousedown.prevent="goToProduct(product.id)"
            class="suggestion-item">
            {{ product.title || 'Unnamed Product' }}
          </li>
        </ul>
      </div>
    </div>

    <CartSlideOver :isOpen="isCartOpen" @close="isCartOpen = false" />
  </header>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>



<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { ShoppingCartIcon, HeartIcon } from '@heroicons/vue/outline'
import CartSlideOver from './CartSlideOver.vue'
import ModalMessage from './ModalMessage.vue'

const isCartOpen = ref(false)
const cart = useCartStore()
const auth = useAuthStore()

const cartItems = computed(() => cart.items)

const router = useRouter()

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

const searchQuery = ref('')
const allProducts = ref([])
const filteredResults = ref([])
const showSuggestions = ref(false)

const loadAllProducts = async () => {
  if (allProducts.value.length) return // already loaded

  try {
    const res = await axios.get('https://api.defonix.com/api/products')
    allProducts.value = res.data || []
  } catch (err) {
    showError("Failed to load products: " + err.message, 'error', 'Load Error')
    console.error('Failed to load products:', err)
  }
}

const onSearchInput = async () => {
  if (!allProducts.value.length) await loadAllProducts()

  const query = searchQuery.value.toLowerCase()
  filteredResults.value = allProducts.value.filter(
    (product) =>
      product.title && product.title.toLowerCase().includes(query)
  )
  showSuggestions.value = true
}

const goToProduct = (id) => {
  showSuggestions.value = false
  searchQuery.value = ''
  router.push(`/products/${id}`)
}

const hideSuggestionsWithDelay = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<style scoped>
.header-wrapper {
  display: flex;
  flex-direction: column;
  padding: 14px 12px;
  border-bottom: 1px #dddddd solid;
  gap: 0.5rem;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.icon {
  width: 16px;
  height: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.input {
  height: 34px;
  font-size: 14px;
  color: #242222;
  padding: 0 12px;
  border: 1px solid #bebebe;
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
  outline: none;
  box-sizing: border-box;
  width: 80%;
}

.button1 {
  height: 34px;
  font-size: 14px;
  padding: 0 16px;
  background-color: #053379;
  color: #fff;
  border: none;
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  cursor: pointer;
  box-sizing: border-box;
}

.links {
  display: flex;
  align-items: center;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  cursor: pointer;
}

.end {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h1 {
  font-family: "Roboto", sans-serif;
}

.search-bar1 {
  display: none;
}

/* Desktop layout */
@media (min-width: 768px) {
  .header-wrapper {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .top-row {
    width: auto;
  }

  .search-row {
    width: 70%;
    display: none;
  }

  .search-bar1 {
    display: flex;
  }
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

#cart {
  position: relative;
}

#count {
  font-size: xx-small;
  position: absolute;
  top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -35%;
  background-color: #053379;
  color: #fff;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
  height: auto;
  width: 15px;
}

/* Hide .search-bar1 by default (mobile) */
.search-bar1 {
  display: none;
}

/* Desktop layout */
@media (min-width: 768px) {
  .header-wrapper {
    flex-direction: column;
    gap: 0.5rem;
    padding: 12px 4rem;
  }

  .top-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-wrapper {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-bar1 {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 500px;
  }

  .search-row {
    display: none;
  }
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  background: white;
  border: 1px solid #ccc;
  width: 80%;
  height: 40vh;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: auto;
}

.suggestion-item {
  padding: 0.5rem;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}
</style>
