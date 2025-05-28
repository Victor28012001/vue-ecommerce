<template>
  <div>
    <Navbar />
    <div class="ok">
      <Wishlist />
    </div>
  </div>
</template>

<script setup>
import Wishlist from '../components/Wishlist.vue';
import Navbar from '../components/Navbar.vue';
</script>
<style scoped>
.ok {
  text-align: left;
  padding: 2rem 4rem;
}
</style>