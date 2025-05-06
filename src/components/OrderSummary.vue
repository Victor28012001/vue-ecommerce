<template>
    <div class="order-summary">
        <h3>Order Summary</h3>
        <ul>
            <li v-for="item in cart" :key="item.id">
                {{ item.name }} x {{ item.quantity }} = ${{ item.price * item.quantity }}
            </li>
        </ul>
        <p>Total: ${{ total }}</p>
        <button>Checkout</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const total = computed(() => {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
</script>