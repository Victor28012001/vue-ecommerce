<template>
    <div v-if="paymentSuccess">
        <div class="empty-wishlist">
            <img :src="Cart" alt="" style="width: 20%;" />
            <h2 style="color: #262525;">Thank You for Your Order!</h2>
            <p style="color: gray;">Your order has been placed successfully. We've sent a confirmation email to {{
                cart.shipping.email }}.</p>
            <div class="hero-buttons">
                <button @click="goBack" class="btn primary">Continue Shopping</button>
                <button class="btn secondary">Track Order</button>
            </div>
        </div>
    </div>
    <div v-else class="container">
        <!-- Step Indicators -->
        <div class="indicator-container">
            <div class="step-container">
                <template v-for="i in totalSteps" :key="'step-' + i">
                    <div class="step-wrapper">
                        <!-- Circle + Title -->
                        <div class="step-indicator-group">
                            <div :class="['step-indicator', { 'active-step': i <= step }]">
                                <component :is="getIconComponent(i)"
                                    :class="['step-icon', { 'active-step-icon': i <= step }]" />
                            </div>
                            <div class="step-title">{{ getStepTitle(i) }}</div>
                        </div>

                        <!-- Connecting Line -->
                        <div v-if="i < totalSteps" class="step-line-container">
                            <div :class="['line', { 'active-line': i < step }]"></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="big-cont">
            <!-- Step Content -->
            <div class="content-container cont1">
                <ShippingForm v-if="step === 1" />
                <PaymentForm v-if="step === 2" />
                <Review v-if="step === 3" />

                <!-- Navigation Buttons -->
                <div class="button-container table-footer">
                    <button v-if="step > 1" @click="handlePrevious" class="button back-button">
                        {{ getBackButtonLabel() }}
                    </button>

                    <button v-if="step < totalSteps" @click="handleNext" class="button next-button">
                        {{ getNextButtonLabel() }}
                    </button>

                    <router-link v-else @click="handleDone" to="/checkout">
                        <button class="button next-button">Place Order</button>
                    </router-link>
                </div>
            </div>

            <div v-if="cart.items.length > 0" class="cont2">
                <OrderSummary :showItems="step === 1 || step === 2" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { HomeIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/vue/outline'
import ShippingForm from './checkout/ShippingForm.vue'
import PaymentForm from './checkout/PaymentForm.vue'
import Review from './checkout/Review.vue'
import OrderSummary from './OrderSummary.vue'
import { useCartStore } from '../stores/cart'
import Cart from "../assets/images/return1.png"

const cart = useCartStore()
const step = ref(1)
const totalSteps = 3

const paymentSuccess = ref(false)

const goBack = () => {
    step.value = 1
    paymentSuccess.value = false
}

const handleNext = () => {
    if (step.value < totalSteps) step.value++
}

const handlePrevious = () => {
    if (step.value > 1) step.value--
}

const handleDone = () => {
    const { firstName, lastName, email, phone, address, city, state: shippingState, zip } = cart.shipping;

    const handler = PaystackPop.setup({
        key: 'pk_test_78d3d54a8141e85996cb25d6cbd082558f9e0b35', // Replace with your real Paystack key
        email: email,
        amount: cart.total * 100, // total from the store, in kobo
        currency: 'NGN',
        ref: 'ref-' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: `${firstName} ${lastName}`
                },
                {
                    display_name: "Phone Number",
                    variable_name: "phone_number",
                    value: phone
                },
                {
                    display_name: "Address",
                    variable_name: "shipping_address",
                    value: `${address}, ${city}, ${shippingState}, ${zip}`
                }
            ]
        },
        callback: function (response) {
            alert('Payment successful! Reference: ' + response.reference)
            paymentSuccess.value = true
            cart.items = []
        },
        onClose: function () {
            alert('Transaction was not completed');
        }
    });

    handler.openIframe();
}


const getIconComponent = (index) => {
    switch (index) {
        case 1: return HomeIcon
        case 2: return CreditCardIcon
        case 3: return CheckCircleIcon
        default: return null
    }
}

const getStepTitle = (index) => {
    switch (index) {
        case 1: return "Shipping"
        case 2: return "Payment"
        case 3: return "Preview"
        default: return ""
    }
}

const getNextButtonLabel = () => {
    switch (step.value) {
        case 1: return "Continue to Payment"
        case 2: return "Review Order"
        default: return "Next"
    }
}

const getBackButtonLabel = () => {
    switch (step.value) {
        case 2: return "Back to Shipping"
        case 3: return "Back to Payment"
        default: return "Back"
    }
}
</script>


<style scoped>
.container {
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
}

.big-cont {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 12px 4rem;
    min-height: 60vh;
    margin: 30px 0;
    width: 100%;
}

@media (min-width: 768px) {
    .big-cont {
        display: flex;
        flex-direction: row;
    }

    .container {
        padding: 50px 20px;
    }

    .content-container {
        width: 60%;
    }

    .cont2 {
        width: 30%;
    }

}

.empty-wishlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    text-align: center;
    gap: 24px;
}

.indicator-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
}

.step-container {
    display: flex;
    width: 80%;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.cont1 {
    width: 70%;
}

/*.cont2 {
    width: 100%;
}*/

.step-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
}

/* Stack circle and title */
.step-indicator-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
}

.step-indicator {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #e7e7e7;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.active-step {
    background-color: #224893;
    border-color: #224893;
}

.step-icon {
    width: 40px;
    height: 40px;
    color: #e7e7e7;
}

.active-step-icon {
    color: white;
}

.step-title {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #224893;
    font-weight: bold;
}

/* Horizontal connecting line container */
.step-line-container {
    flex: 1;
    height: 2px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Actual line between steps */
.line {
    height: 2px;
    width: 100%;
    margin: 0 16px;
    background-color: #e7e7e7;
}

.active-line {
    background-color: #224893;
}

.content-container {
    flex: 1;
    text-align: center;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #d4d2d2;
    height: fit-content;
}

.button-container {
    display: flex;
    gap: 10px;
}

.button {
    padding: 10px 20px;
    border: none;
    font-weight: bold;
    cursor: pointer;
}

.back-button {
    background-color: #ffffff;
    color: #2d298e;
    border: 1px solid #ccc;
}

.next-button {
    background-color: #224893;
    color: white;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
}

.hero-buttons {
    display: flex;
    gap: 16px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 10px;
}

.primary {
    background-color: #053379;
    color: #fff;
}

.secondary {
    background-color: #fcfbfb;
    color: #053379;
    border: 1px #c0bfbf solid;
}
</style>
