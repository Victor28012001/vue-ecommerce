<!-- src/components/Navbar.vue -->
<template>
  <nav class="p-4 bg-gray-100">
    <!-- Special views: account pages, wishlist, cart, etc. -->
    <div v-if="customLabel || isCategoryView || isWishlistView || isCartView || isCheckoutView" class="cat">
      <router-link to="/" class="nav-link">Home /</router-link>
      <span class="nav-link">
        {{
          customLabel
            ? 'Account / ' + customLabel
            : isWishlistView
              ? 'Wishlist'
              : isCartView
                ? 'Cart'
                : isCheckoutView
                  ? 'Checkout'
                  : routeCategoryName
        }}
      </span>
    </div>

    <!-- Product or category breadcrumb passed as props -->
    <div v-else-if="categories?.length" class="cat">
      <router-link to="/" class="nav-link">Home /</router-link>

      <template v-for="(cat, index) in categories" :key="index">
        <router-link :to="`/category/${encodeURIComponent(cat)}/`" class="nav-link">
          {{ cat }}
          <span v-if="index < categories.length - 1"> /</span>
        </router-link>
      </template>

      <span v-if="current" class="nav-link"> / {{ current }}</span>
    </div>


    <!-- Default: show static category links -->
    <div v-else class="cat">
      <router-link v-for="(category, index) in apiCategories" :key="category.slug" :to="`/category/${category.slug}`"
        class="nav-link">
        {{ category.name }}
        <span v-if="index < apiCategories.length - 1"> </span>
      </router-link>

    </div>
  </nav>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ModalMessage from './ModalMessage.vue'

const props = defineProps({
  customLabel: String,
  categories: {
    type: Array,
    default: () => [],
  },
  current: {
    type: String,
    default: '',
  },
})

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

const route = useRoute()
const isCategoryView = route.path.startsWith('/category/')
const isWishlistView = route.path === '/wishlist'
const isCartView = route.path === '/cart'
const isCheckoutView = route.path === '/checkout'

const routeCategoryName =
  route.params.name?.charAt(0).toUpperCase() + route.params.name?.slice(1)

// ✅ This will replace staticCategories
const apiCategories = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('https://api.defonix.com/api/categories/')
    apiCategories.value = data
      .filter(c => c.is_public && c.ancestors_are_public)
      .map(c => ({
        name: c.name,
        slug: c.slug,
      }))
  } catch (err) {
    console.error('Failed to load categories:', err)
    showError("Failed to load categories: " + err.message, 'error', 'Category Error')
  }
})
</script>



<style scoped>
.nav-link {
  color: #5e5c5c;
  text-decoration: none;
  font-weight: bold;
  font-size: smaller;
  text-wrap-mode: nowrap;
}

.nav-link:hover {
  color: #555555;
}

.cat {
  display: flex;
  gap: 12px;
  font-family: "Roboto", sans-serif;
}

nav {
  padding: 24px 4rem;
  border-bottom: 1px #dddddd solid;
}

@media (max-width: 768px) {
  nav {
    padding: 12px 2rem;
    overflow-x: scroll;
  }
}
</style>
