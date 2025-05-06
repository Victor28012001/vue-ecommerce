<template>
  <div class="product-card">
    <img :src="product.image" alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>${{ product.price }}</p>
    <button @click="$emit('add-to-cart', product)">Add to Cart</button>
    <button @click="$emit('toggle-wishlist', product)">
      {{ product.inWishlist ? '♥' : '♡' }}
    </button>
  </div>
</template>

<script setup>
defineProps(['product'])
</script>
