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
      <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product"
        @add-to-cart="$emit('add-to-cart', $event)" />
    </div>
    <div class="end">
      <button class="button" @click="loadMore" :disabled="visibleCount >= products.length">
        View More Products
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'


const props = defineProps(['products'])
const emit = defineEmits(['add-to-cart'])

const visibleCount = ref(8)

const visibleProducts = computed(() => {
  return props.products.slice(0, visibleCount.value)
})

function loadMore() {
  visibleCount.value += 8
}
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
  .featured-products{
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
</style>