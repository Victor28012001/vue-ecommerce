<template>
  <div class="cart-card">
    <img :src="item.image" alt="item.name" />
    <div>
      <h4>{{ item.name }}</h4>
      <p>Quantity: {{ item.quantity }}</p>
      <p>Total: ${{ item.price * item.quantity }}</p>
      <button @click="$emit('remove', item.id)">Remove</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['item'])
</script>
