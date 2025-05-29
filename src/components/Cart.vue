<template>
    <div class="wishlist">
        <div v-if="cart.items.length === 0">
            <div class="empty-wishlist">
                <img :src="Cart" alt="" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any products to your cart yet.</p>
                <button @click="goBack">Continue Shopping</button>
            </div>
        </div>

        <div v-else class="table-cont">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <CartRow v-for="item in cart.items" :key="item.id" :item="item" @remove="removeItem"
                        @update-quantity="updateQuantity" />
                </tbody>
            </table>
            <div class="table-footer">
                <button class="clear-cart" @click="clearCart">
                    <img :src="delet" alt=""> Clear Cart
                </button>
                <button @click="goBack" class="continue-shopping">
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import CartRow from './CartRow.vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import Cart from "../assets/images/Cart1.png"
import delet from "../assets/images/delete.png"

const cart = useCartStore()
const router = useRouter()

function goBack() {
    router.back()
}

// Remove item using store action
function removeItem(id) {
    cart.removeItem(id)
}

// Update quantity (mutate the store directly here)
function updateQuantity({ id, quantity }) {
    const item = cart.items.find(i => i.id === id)
    if (item) {
        // clamp quantity between min and max
        const newQty = Math.min(Math.max(quantity, 1), 10)
        item.quantity = newQty
    }
}

function clearCart() {
    cart.items = []  // or call a store action like: cart.clearCart()
}


</script>

<style scoped>
.cart-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    /* margin-top: 1.5rem; */
}

.cart-table thead {
    background-color: #F9F9F9;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
}

.cart-table th {
    padding: 16px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    border-top: none;
}

.cart-table thead tr {
    border: 1px solid #ddd;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.cart-table tbody td {
    padding: 18px 12px;
    border-bottom: 1px solid #eee;
    text-align: center;
    vertical-align: middle;
}

.cart-table td span.remove-icon {
    color: red;
    font-weight: bold;
    cursor: pointer;
    margin-left: 12px;
    position: relative;
    top: -4px;
    font-size: 1.2rem;
}

.table-cont {
    border-radius: 12px;
    overflow: auto;
    border: 1px solid #d4d2d2;
}

.empty-wishlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
    gap: 24px;
    background-color: #F9F9F9;
}

.empty-wishlist button {
    color: white;
    background-color: #224893;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
}

.clear-cart {
    background-color: white;
    color: #ff4d4f;
    border: 1px solid #d4d2d2;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
}

.clear-cart:hover {
    background-color: #d9363e;
    color: white;
}

.continue-shopping {
    background-color: #224893;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
}
</style>