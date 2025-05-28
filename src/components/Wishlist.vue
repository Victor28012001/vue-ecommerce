<template>
  <div class="wishlist">
    <div v-if="wishlist.items.length === 0">
      <div class="empty-wishlist">
        <img :src="Cart" alt="" />
        <h2>Your wishlist is empty</h2>
        <p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
        <button @click="goBack">Continue Shopping</button>
      </div>
    </div>
    <div v-else class="product-grid">
      <ProductCard v-for="product in wishlist.items" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/wishlist'
import ProductCard from '../components/ProductCard.vue'
import Cart from "../assets/images/Cart.png"

const wishlist = useWishlistStore()
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.product-grid {
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
  margin-bottom: 12px;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  gap: 24px;
}

.empty-wishlist button {
  color: white;
  background-color: #224893;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #F9F9F9;
}
</style>