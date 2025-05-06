<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Your Wishlist</h1>
      <ProductCard
        v-for="product in wishlist.items"
        :key="product.id"
        :product="product"
        :is-wishlisted="true"
      />
    </div>
  </template>
  
  <script setup>
  import { useWishlistStore } from '../stores/wishlist'
  import ProductCard from '../components/ProductCard.vue'
  
  const wishlist = useWishlistStore()
  </script>
  