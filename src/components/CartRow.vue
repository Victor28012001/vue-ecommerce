<template>
  <tr>
    <td class="product-info">
      <img :src="item.image" :alt="item.title.split(' - ')[0]" />
      <div class="prod-infos">
        <span>{{ item.title.split(' - ')[0] }}</span>
        <span>{{ item.category }}</span>
      </div>
    </td>
    <td class="tr1">NGN{{ item.new_price?.toFixed(2) / quantity ?? '0.00' }}</td>
    <td class="tr2">
      <div class="quantity">
        <button class="minus" aria-label="Decrease" @click="decrease" :disabled="quantity <= minQuantity">
          &minus;
        </button>
        <input type="number" class="input-box" v-model.number="quantity" :min="minQuantity" :max="maxQuantity"
          @input="validateQuantity" />
        <button class="plus" aria-label="Increase" @click="increase" :disabled="quantity >= maxQuantity">
          &plus;
        </button>
      </div>
    </td>
    <td>
      <span class="total">NGN{{ (item.new_price)?.toFixed(2) ?? '0.00' }}</span>
      <span class="remove-icon" @click="$emit('remove', item.id)">✖</span>
    </td>
  </tr>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>


<script setup>
import { ref, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import ModalMessage from './ModalMessage.vue'

// Props passed in from cart store/component
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove', 'update-quantity'])

const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('Error')
const modalType = ref('error') // or success, info, warning

function showError(message, type = 'error', title = 'Error') {
  modalMessage.value = message
  modalType.value = type
  modalTitle.value = title
  showModal.value = true
}

const cart = useCartStore()
const minQuantity = 1
const maxQuantity = 10

const quantity = ref(props.item.quantity ?? 1)



// Update backend with new quantity
async function updateQuantityAPI(newQuantity) {
  try {
    await cart.updateItemQuantity({
      lineUrl: props.item.basketLineUrl,
      quantity: newQuantity
    })

    emit('update-quantity', { id: props.item.id, quantity: newQuantity });
  } catch (error) {
    // console.error('Failed to update quantity:', error);
    showError("Failed to update quantity: " + error.message, 'error', 'Update Error')
  }
}

// Quantity input and buttons
function validateQuantity() {
  if (quantity.value < minQuantity) quantity.value = minQuantity;
  if (quantity.value > maxQuantity) quantity.value = maxQuantity;
}

function decrease() {
  if (quantity.value > minQuantity) quantity.value--;
}

function increase() {
  if (quantity.value < maxQuantity) quantity.value++;
}

// Watch quantity and trigger API update with debounce
let updateTimeout
watch(quantity, (newQuantity) => {
  validateQuantity()
  clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    updateQuantityAPI(newQuantity)
  }, 500) // 500ms debounce
})
</script>



<style scoped>
.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prod-infos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.product-info img {
  width: 20%;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.quantity {
  display: flex;
  overflow: hidden;
  justify-content: left;
}

.quantity button {
  background-color: #E2E8F0;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 20px;
  width: 30px;
  text-align: center;
  transition: background-color 0.2s;
  border-radius: 6px;
}

.quantity button:disabled {
  background-color: transparent;
  cursor: not-allowed;
  border: 1px solid #E7E7E7;
}

.quantity button:hover:not(:disabled) {
  background-color: #575757;
}

.input-box {
  width: 50px;
  text-align: center;
  border: none;
  padding: 8px 10px;
  font-size: 16px;
  outline: none;
}

/* Hide number input spin buttons */
.input-box::-webkit-inner-spin-button,
.input-box::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-box[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

@media (max-width: 768px) {
  tr {
    position: relative;
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 10px;
    width: max-content;
  }

  .tr1 {
    position: absolute;
    left: 22%;
    top: 80%;
    font-size: smaller;
    font-weight: 500;
    padding: 0;
  }

  .tr2 {
    position: absolute;
    left: 55%;
    top: 55%;
    font-size: smaller;
    font-weight: 500;
    padding: 0;
  }

  .total {
    display: none;
  }
}

td {
  padding: 18px 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
  vertical-align: middle;
}

td span.remove-icon {
  color: red;
  font-weight: bold;
  cursor: pointer;
  margin-left: 12px;
  position: relative;
  top: -4px;
  font-size: 1.2rem;
}
</style>
