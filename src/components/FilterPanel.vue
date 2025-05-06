<template>
    <div class="filter-panel">
      <h4>Filters</h4>
      <label>
        Price Range:
        <input type="range" min="0" max="1000" v-model="price" />
      </label>
      <select v-model="type">
        <option disabled value="">Select Type</option>
        <option>New</option>
        <option>Popular</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const price = ref(500)
  const type = ref('')
  
  watch([price, type], () => {
    emit('filter-changed', { price: price.value, type: type.value })
  })
  
  const emit = defineEmits(['filter-changed'])
  </script>
  