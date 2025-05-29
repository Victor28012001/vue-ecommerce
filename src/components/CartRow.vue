<template>
  <tr>
    <td class="product-info">
      <img :src="item.image" :alt="item.name" />
      <div class="prod-infos">
        <span>{{ item.name }}</span>
        <span>{{ item.category }}</span>
      </div>
    </td>
    <td>${{ item.new_price?.toFixed(2) ?? '0.00' }}</td>
    <td>
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
      ${{ (item.new_price * quantity)?.toFixed(2) ?? '0.00' }}
      <span class="remove-icon" @click="$emit('remove', item.id)">✖</span>
    </td>
  </tr>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

console.log(props.item)

const emit = defineEmits(['remove', 'update-quantity'])

const minQuantity = 1
const maxQuantity = 10

const quantity = ref(props.item.quantity ?? 1)


function validateQuantity() {
  if (quantity.value < minQuantity) quantity.value = minQuantity
  if (quantity.value > maxQuantity) quantity.value = maxQuantity
}

function decrease() {
  if (quantity.value > minQuantity) quantity.value--
}

function increase() {
  if (quantity.value < maxQuantity) quantity.value++
}

// Watch quantity and notify parent
watch(quantity, (newQuantity) => {
  emit('update-quantity', { id: props.item.id, quantity: newQuantity })
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
