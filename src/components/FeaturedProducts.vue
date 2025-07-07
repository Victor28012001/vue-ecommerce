<template>
  <section class="featured-products">
    <div class="top">
      <div class="left">
        <h2>Featured Products</h2>
        <p>Checkout our top-categories</p>
      </div>
      <div class="right">
        <button class="button">New Arrivals</button>
        <button class="button">Best Sellers</button>
        <button class="button">Top Rated</button>
      </div>
    </div>
    <div class="product-grid">

      <!-- Loading State -->
      <p v-if="loading" class="loading-text">
        Loading products<span class="dot-loader">{{ dots }}</span>
      </p>

      <!-- Empty State -->
      <p v-else-if="!products || products.length === 0">No products found.</p>
      <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product"
        @add-to-cart="$emit('add-to-cart', $event)" />
    </div>
    <div class="end">
      <button class="button" v-if="!loading && visibleProducts.length < products.length" @click="loadMore" :disabled="visibleCount >= products.length">
        View More Products
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: Array,
  loading: Boolean
})

const emit = defineEmits(['add-to-cart'])

const visibleCount = ref(8)
const visibleProducts = computed(() => props.products.slice(0, visibleCount.value))
function loadMore() {
  visibleCount.value += 8
}

// Dots Animation for Loading
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
.featured-products {
  text-align: left;
  padding: 2rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

p {
  font-size: x-small;
  color: #979494;
}

.product-grid {
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

/* Medium screens (768px and above) */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .featured-products {
    padding: 12px 4rem;
  }
}

/* Large screens (1024px and above) */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.right {
  display: flex;
  gap: 0.42em;
}


@media (max-width: 768px) {
  .top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    width: 100%;
    gap: 14px;
  }
}


.end button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-text {
  font-size: 0.9rem;
  color: #555;
  margin-top: 1rem;
}

.dot-loader {
  display: inline-block;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>