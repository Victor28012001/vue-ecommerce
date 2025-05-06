<template>
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="$emit('add-to-cart', $event)"
        />
      </div>
    </section>
  </template>
  
  <script setup>
  import ProductCard from './ProductCard.vue'
  defineProps(['products'])
  defineEmits(['add-to-cart'])
  </script>
  