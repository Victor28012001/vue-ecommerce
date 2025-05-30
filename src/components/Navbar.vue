<!-- src/components/Navbar.vue -->
<template>
  <nav class="p-4 bg-gray-100">
    <div v-if="isCategoryView || isWishlistView || isCartView || isCheckoutView" class="cat">
      <router-link to="/" class="nav-link">Home / </router-link>
      <span class="nav-link">
        {{
          isWishlistView ? 'Wishlist' :
            isCartView ? 'Cart' :
              isCheckoutView ? 'Checkout' :
        routeCategoryName
        }}

      </span>
    </div>

    <div v-else class="cat">
      <router-link v-for="category in categories" :key="category" :to="`/category/${category.toLowerCase()}`"
        class="nav-link">
        {{ category }}
      </router-link>
    </div>
  </nav>
</template>


<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const categories = [
  'Laptops',
  'Desktops',
  'Printers',
  'Monitors',
  'Phones',
  'Accessories',
]

const isCategoryView = route.path.startsWith('/category/')
const isWishlistView = route.path === '/wishlist'
const isCartView = route.path === '/cart'
const isCheckoutView = route.path === '/checkout'

const routeCategoryName =
  route.params.name?.charAt(0).toUpperCase() + route.params.name?.slice(1)
</script>

<style scoped>
.nav-link {
  color: #5e5c5c;
  text-decoration: none;
  font-weight: bold;
  font-size: smaller;
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
  }
}
</style>
