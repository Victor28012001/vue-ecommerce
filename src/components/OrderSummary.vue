<template>
    <div class="order-summary">
        <h3>Order Summary</h3>

        <div v-if="showItems">
            <div v-for="item in cart.items" :key="item.id" class="summary-row">
                <span style="width: 30%;"><img :src="item.image" alt="" style="width: 70%;"></span>
                <span style="width: 50%; display: flex; flex-direction: column;justify-content: space-between;"><span>{{
                        item.title.split(' - ')[0] }}</span> <span style="color: #0f0f0f; font-size: smaller;">Qty:
                        {{ item.quantity }}</span></span>
                <span style="width: 20%;font-weight: 500;font-size: smaller;display: flex;align-items: end;">{{
                    formatCurrency(item.new_price * item.quantity) }}</span>
            </div>
            <hr />
        </div>

        <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
        </div>

        <div class="summary-row">
            <span>Tax (10%):</span>
            <span>{{ formatCurrency(tax) }}</span>
        </div>

        <hr />
        <div class="summary-row total">
            <strong>Total:</strong>
            <strong>{{ formatCurrency(total) }}</strong>
        </div>

        <!-- Button is shown only when not on /checkout -->
        <router-link v-if="showButton" to="/checkout">
            <button>Proceed To Checkout</button>
        </router-link>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRoute } from 'vue-router'

// Route-aware logic
const route = useRoute()
const showButton = computed(() => route.path !== '/checkout')

// Optional prop: showItems
const props = defineProps({
    showItems: {
        type: Boolean,
        default: false,
    },
})

const cart = useCartStore()

const subtotal = computed(() =>
    cart.items.reduce((sum, item) => sum + item.new_price * item.quantity, 0)
)

const tax = computed(() => subtotal.value * 0.1)
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
    padding: 1.5rem;
    border-radius: 18px;
    border: 1px solid #d4d2d2;
}

.order-summary h3 {
    margin-bottom: 1rem;
    border-bottom: darkgray 1px solid;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    font-size: 0.95rem;
}

.summary-row.total {
    margin-top: 1rem;
    font-size: 1.05rem;
    font-weight: bold;
}

.order-summary button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #224893;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
}
</style>
