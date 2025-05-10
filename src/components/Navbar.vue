<template>
    <nav class="p-4 bg-gray-100">
        <div v-if="!isCategoryView" class="cat">
            <router-link v-for="category in categories" :key="category" :to="`/category/${category.toLowerCase()}`"
                class="nav-link">
                {{ category }}
            </router-link>
        </div>

        <div v-else class="cat">
            <router-link to="/" class="nav-link">Home / </router-link>
            <span class="nav-link">{{ routeCategoryName }}</span>
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
const routeCategoryName = route.params.name?.charAt(0).toUpperCase() + route.params.name?.slice(1)
</script>

<style scoped>
.nav-link {
  color: #5e5c5c;           /* Dark gray */
  text-decoration: none; /* No underline */
  font-weight: bold;
  font-size: smaller;
}

.nav-link:hover {
  color: #555555;
}

.cat{
    display: flex;
    gap: 12px;
    font-family: "Roboto", sans-serif;
}
nav{
    padding: 24px 4px;
    border-bottom: 1px #dddddd solid;
}
</style>