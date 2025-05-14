<template>
  <div class="font-sans text-gray-900">
    <Banner />
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Banner from './components/Banner.vue';
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
