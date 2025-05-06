<template>
    <div>
      <Navbar />
      <div class="p-4 grid grid-cols-2 gap-4">
        <ProductCard
          v-for="product in categoryProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Navbar from '../components/Navbar.vue'
  import ProductCard from '../components/ProductCard.vue'
  
  const route = useRoute()
  
  const allProducts = [
    { id: 1, name: 'MacBook Pro', category: 'laptops' },
    { id: 2, name: 'Dell XPS', category: 'laptops' },
    { id: 3, name: 'iPhone 14', category: 'phones' },
    { id: 4, name: 'HP LaserJet', category: 'printers' },
    { id: 5, name: 'Acer Monitor', category: 'monitors' },
    { id: 6, name: 'Wireless Mouse', category: 'accessories' },
  ]
  
  const categoryProducts = computed(() =>
    allProducts.filter(
      (p) => p.category.toLowerCase() === route.params.name.toLowerCase()
    )
  )
  </script>
  