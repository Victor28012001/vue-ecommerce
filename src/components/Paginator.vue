<template>
    <div class="paginator">
      <button :disabled="page <= 1" @click="$emit('change', page - 1)">Prev</button>
      <span>Page {{ page }}</span>
      <button @click="$emit('change', page + 1)">Next</button>
    </div>
  </template>
  
  <script setup>
  defineProps(['page'])
  </script>
  