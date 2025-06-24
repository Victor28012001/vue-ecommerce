<template>
    <div class="form-section table-cont">
        <h3>Review Your Order</h3>
        <div class="cont">
            <div class="cont1">
                <div class="cont2">
                    <h4>Shipping Information</h4>
                    <div class="info">
                        <p>{{ cart.shipping.firstName }}</p>
                        <p>{{ cart.shipping.lastName }}</p>
                        <p>{{ cart.shipping.address }}</p>
                        <p>{{ cart.shipping.phone }}</p>
                        <p>{{ cart.shipping.email }}</p>
                        <p>{{ cart.shipping.city }}</p>
                        <p>{{ cart.shipping.state }}</p>
                        <p>{{ cart.shipping.zip }}</p>
                    </div>
                </div>
                <div class="cont2">
                    <h4>Payment Method</h4>
                    <div class="info">
                        <span style="gap: 6px;display: flex; width: 100%; align-items: center;">
                            <CreditCardIcon class="step-icon" /> Credit Card ending in ****
                        </span>
                    </div>
                </div>
            </div>
            <div class="orders">
                <h4>Order Items</h4>
                <div style="width: 100%;">
                    <div v-for="item in cart.items" :key="item.id" class="summary-row">
                        <span style="width: 120px; height: 100%;"><img :src="item.image" alt=""
                                style="width: 70%;"></span>
                        <span
                            style="width: 50%;display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start;font-size: smaller;"><span>{{
                                item.title.split(' - ')[0] }}</span> <span
                                style="color: #0f0f0f; font-size: smaller;">Qty:
                                {{ item.quantity }}</span></span>
                        <span
                            style="width: 20%;font-weight: 500;font-size: smaller;display: flex;align-items: center;">{{
                                formatCurrency(item.new_price * item.quantity) }}</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script setup>
import { useCartStore } from '../../stores/cart'
import { CreditCardIcon } from '@heroicons/vue/outline'

const cart = useCartStore()


function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}

const checkout = async () => {

    try {
        const order = await cart.checkout();
        console.log("Order response:", order);
        return true;
    } catch (error) {
        console.error("Checkout error:", error);
        return false;
    }
};

defineExpose({ checkout }); 
</script>

<style scoped>
.form-section {
    width: 100%;
    /* max-width: 700px; */
    /* border-radius: 10px; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.table-cont {
    /* border-radius: 12px; */
    overflow: auto;
    /* border: 1px solid #d4d2d2; */
}

h3 {
    padding: 16px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    border-top: none;
}

h3 {
    margin-bottom: 20px;
    color: #262525;
    font-size: 22px;
    text-align: left;
    background-color: #F9F9F9;
}

.cont {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    gap: 12px;
}


.cont1 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
}

.cont2 {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    gap: 6px;
}

@media (min-width: 768px) {
    .cont1 {
        display: flex;
        flex-direction: row;
    }

    .cont2 {
        width: 50%;
    }
}

.info {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    align-items: flex-start;
    border: 1px solid #E2E8F0;
    padding: 12px;
    border-radius: 12px;
    font-size: small;
    width: 90%;
    text-align: left;
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
    height: 60px;
}

.step-icon {
    width: 24px;
    height: 24px;
    color: #7e7979;
}


.orders {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
