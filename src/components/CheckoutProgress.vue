<template>
  <div class="container">
    <!-- Step Indicators -->
    <div class="indicator-container">
      <div class="step-container">
        <template v-for="i in totalSteps" :key="'step-' + i">
          <div class="step-wrapper">
            <!-- Circle + Title -->
            <div class="step-indicator-group">
              <div :class="['step-indicator', { 'active-step': i <= step }]">
                <component
                  :is="getIconComponent(i)"
                  :class="['step-icon', { 'active-step-icon': i <= step }]"
                />
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

const cart = useCartStore()
const step = ref(1)
const totalSteps = 3

const handleNext = () => {
  if (step.value < totalSteps) step.value++
}

const handlePrevious = () => {
  if (step.value > 1) step.value--
}

const handleDone = () => {
  alert('Order placed!')
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
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
}

.big-cont {
  display: flex;
  gap: 2rem;
  padding: 12px 4rem;
  min-height: 60vh;
  margin: 30px 0;
  width: 100%;
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

.cont2 {
  width: 30%;
}

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
  width: 60%;
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
  background-color: #e7e7e7;
  color: gray;
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

</style>
