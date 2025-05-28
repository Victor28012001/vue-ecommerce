<template>
  <Navbar />
  <div class="cont p-4" :class="{ 'single-column': cart.items.length === 0 }">
    <div class="cont1">
      <Cart />
    </div>
    <div v-if="cart.items.length > 0" class="cont2">
      <OrderSummary :total="cart.total" />
    </div>
  </div>
</template>


<script setup>
import { useCartStore } from '../stores/cart'
import Cart from '../components/Cart.vue'
import OrderSummary from '../components/OrderSummary.vue'
import Navbar from '../components/Navbar.vue';

const cart = useCartStore()
</script>

<style scoped>
.cont {
  display: flex;
  gap: 4rem;
  padding: 12px 4rem;
  min-height: 60vh;
}

.cont1 {
  width: 70%;
}

.cont2 {
  width: 30%;
}

/* Make the cart full-width when empty */
.single-column {
  flex-direction: column;
}

.single-column .cont1 {
  width: 100%;
}
</style>
