<template>
    <div class="wishlist">
      <h3>Wishlist</h3>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
          <button @click="$emit('remove', item.id)">Remove</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps(['items'])
  </script>
  