<template>
    <div class="order-summary">
        <h3>Order Summary</h3>

        <div v-if="showItems">
            <div v-for="item in cart.items" :key="item.id" class="summary-row">
                <span id="span1"><img :src="item.image" alt="" style="width: 70%;"></span>
                <span id="span2"><span>{{
                    item.title.split(' - ')[0] }}</span> <span style="color: #0f0f0f; font-size: smaller;">Qty:
                        {{ item.quantity }}</span></span>
                <span id="span3">{{
                    formatCurrency(item.new_price) }}</span>
            </div>
            <hr />
        </div>

        <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
        </div>

        <div class="summary-row">
            <span>Tax:</span>
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

const subtotal = computed(() => cart.basketTotals.total_excl_tax || 0)
const tax = computed(() => cart.basketTotals.total_tax || 0)
const total = computed(() => cart.basketTotals.total_incl_tax || 0)


function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cart.basketTotals.currency || 'USD',
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

#span1 {
    width: 30%;
}

#span2 {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#span3 {
    width: 30%;
    font-weight: 500;
    font-size: smaller;
    display: flex;
    align-items: end;
}

@media (max-width: 766px) {
    #span2 {
        width: 40%;
    }

    #span3 {
        width: 30%;
    }
}
</style>
