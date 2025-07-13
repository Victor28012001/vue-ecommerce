<!-- CartSlideOver.vue -->
<template>
    <div v-if="isOpen" class="overlay" @click.self="closeCart">
        <div class="cart-panel">
            <div class="cart-header">
                <h2 class="title">Shopping Cart</h2><span>({{ cartItems.length }})</span>
                <button class="close-btn" @click="closeCart">
                    <span class="sr-only">Close panel</span>
                    ✕
                </button>
            </div>

            <div class="cart-body">
                <!-- Empty Cart Message -->
                <div v-if="cartItems.length === 0" class="empty-cart-message">
                    <p>Your cart is currently empty.</p>
                </div>

                <!-- Cart Items List -->
                <ul v-else class="cart-items">
                    <li class="cart-item" v-for="item in cartItems" :key="item.id">
                        <div class="item-img">
                            <img :src="item.image" :alt="item.title.split(' - ')[0]" />
                        </div>
                        <div class="item-details">
                            <div class="item-title-price">
                                <h3>{{ item.title.split(' - ')[0] }}</h3>
                                <button @click="removeItem(item.id)" class="remove-btn">✕</button>
                            </div>
                            <div class="item-footer">
                                <p>Qty {{ item.quantity }}</p>
                                <p>NGN{{ item.new_price?.toFixed(2) }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Cart Footer: Only show if there are items -->
            <div class="cart-footer">
                <div class="subtotal">
                    <p>Subtotal</p>
                    <p>NGN{{ total.toFixed(2) }}</p>
                </div>
                <router-link to="/checkout" class="checkout-btn" v-if="cartItems.length > 0">
                    Checkout Now
                </router-link>
                <router-link to="/cart" class="continue">
                    <button @click="closeCart">View Cart</button>
                </router-link>
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart' // adjust path as needed

const props = defineProps({
    isOpen: Boolean
})
const emit = defineEmits(['close'])

const cart = useCartStore()  // define once at top

onMounted(async () => {
    await cart.loadBasketItems()
})

const cartItems = computed(() => cart.items)
const total = computed(() => cart.total)

const closeCart = () => emit('close')
const removeItem = (id) => cart.removeItem(id)
</script>


<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    /* background: rgba(107, 114, 128, 0.75); */
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}

.cart-panel {
    width: 100%;
    max-width: 320px;
    background: white;
    display: flex;
    flex-direction: column;
    height: 50%;
    overflow-y: auto;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.4);
    animation: slideIn-37e5d91e 0.4s ease forwards;
    border-radius: 12px;
    position: absolute;
    right: 4%;
    top: 12%;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0%);
    }
}

@media (min-width: 768px) {
    .cart-panel {
        right: 5%;
        top: 10%;
    }

}

.cart-header {
    display: flex;
    padding: 24px;
    border-bottom: 1px solid #ddd;
    gap: 12px;
    align-items: center;
}

.title {
    font-size: 18px;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: none;
}

.cart-body {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.cart-items {
    list-style: none;
    margin: 0;
    padding: 0;
}

.cart-item {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
}

.item-img {
    flex-shrink: 0;
    width: 63px;
    height: 63px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: small;
    justify-content: space-between;
}

.item-title-price {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
}

.item-color {
    font-size: 13px;
    color: #666;
    margin: 6px 0;
}

.item-footer {
    display: flex;
    font-size: 13px;
    color: #666;
    gap: 8px;
}

.remove-btn {
    background: none;
    color: #224893;
    border: none;
    cursor: pointer;
    padding: 0;
}

.cart-footer {
    padding: 24px;
    border-top: 1px solid #ddd;
    font-size: small;
}

.subtotal {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 8px;
}

.note {
    font-size: 12px;
    color: #666;
    margin-bottom: 16px;
}

.checkout-btn {
    display: block;
    background-color: #224893;
    color: white;
    text-align: center;
    padding: 12px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 16px;
}

.continue {
    font-size: 13px;
    text-align: center;
    border: 1px solid gray;
    border-radius: 6px;
    padding: 12px;
    display: block;
}

.continue button {
    background: none;
    border: none;
    color: #224893;
    cursor: pointer;
    font-weight: 500;
}
</style>
