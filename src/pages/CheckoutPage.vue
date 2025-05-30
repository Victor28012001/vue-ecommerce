<template>
    <Navbar />
    <div class="cont p-4" :class="{ 'single-column': cart.items.length === 0 }">
        <div class="cont1">
            <CheckoutProgress />
        </div>
    </div>
</template>


<script setup>
import { useCartStore } from '../stores/cart'
import Navbar from '../components/Navbar.vue';
import CheckoutProgress from '../components/CheckoutProgress.vue';

const cart = useCartStore()
</script>

<style scoped>
.cont {
    display: flex;
    gap: 4rem;
    padding: 12px 2rem;
    min-height: 60vh;
}

@media (min-width: 768px) {
    .cont {
        display: flex;
        gap: 4rem;
        padding: 12px 4rem;
        min-height: 60vh;
    }
}

.cont1 {
    width: 100%;
}

.single-column {
    flex-direction: column;
}

.single-column .cont1 {
    width: 100%;
}
</style>
