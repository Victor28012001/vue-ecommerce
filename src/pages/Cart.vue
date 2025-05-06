<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Your Cart</h1>
      <CartCard
        v-for="item in cart.items"
        :key="item.id"
        :product="item"
      />
      <OrderSummary :total="cart.total" />
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '../stores/cart'
  import CartCard from '../components/CartCard.vue'
  import OrderSummary from '../components/OrderSummary.vue'
  
  const cart = useCartStore()
  </script>
  