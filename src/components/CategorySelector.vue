<template>
  <div class="category-selector">
    <button
      v-for="category in categories"
      :key="category"
      @click="$emit('select', category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
defineProps(['categories'])
</script>
