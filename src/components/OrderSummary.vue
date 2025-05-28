<template>
    <div class="order-summary">
        <h3>Order Summary</h3>
        <p>Subtotal: {{ formatCurrency(subtotal) }}</p>
        <p>Tax (10%): {{ formatCurrency(tax) }}</p>
        <p><strong>Total: {{ formatCurrency(total) }}</strong></p>
        <button>Checkout</button>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const subtotal = computed(() =>
    cart.items.reduce((sum, item) => sum + item.new_price * item.quantity, 0)
)

const tax = computed(() => subtotal.value * 0.1) // 10% tax

const total = computed(() => subtotal.value + tax.value)

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}
</script>

<style scoped>
.order-summary {
    /* background-color: #f8f8f8; */
    padding: 1.5rem;
    border-radius: 8px;
    /* max-width: 300px; */
}

.order-summary h3 {
    margin-bottom: 1rem;
}

.order-summary p {
    margin: 0.5rem 0;
}

.order-summary button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #224893;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
}
</style>
