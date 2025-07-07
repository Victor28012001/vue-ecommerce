<template>
  <section class="top-category">
    <h2>Top Categories</h2>
    <p v-if="loading">Loading categories<span class="dot-loader">{{ dots }}</span></p>
    <p>Checkout our top-categories</p>
    <ul class="categories-grid">
      <li v-for="cat in categories" :key="cat.name" class="category-card">
        <img :src="cat.image" :alt="cat.name" class="category-image" />
        <div class="category-name">{{ cat.name }}</div>
        <div class="category-count">{{ cat.count }} products</div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  categories: Array,
  loading: Boolean,
})

const dots = ref('.')
let interval = null

onMounted(() => {
  if (props.loading) {
    interval = setInterval(() => {
      dots.value = dots.value.length >= 4 ? '.' : dots.value + '.'
    }, 500)
  }
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>


<style scoped>
.top-category {
  text-align: left;
  padding: 2rem 4rem;
  background-color: #f9f9f9;
}

p {
  font-size: x-small;
  color: #979494;
}

.dot-loader {
  font-weight: bold;
  font-size: small;
}


.categories-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 2rem;
  margin-top: 2rem;
  list-style: none;
  padding: 0;
  width: 100%;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 14%;
}

.category-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #333;
}

.category-count {
  font-size: x-small;
  color: #777;
}

@media (max-width : 768px) {
  .top-category {
    padding: 12px 2rem;
  }

  .categories-grid {
    display: grid;
    width: 100%;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
  }

  .category-card {
    width: auto;
  }
}
</style>