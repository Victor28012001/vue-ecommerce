<template>
  <div id="orders">
    <h2>Order History</h2>
    <p v-if="orders.length === 0">No orders found.</p>
    <ul v-else>
      <li v-for="order in orders" :key="order.number">
        Order #{{ order.number }} - {{ order.status }} - {{ order.total_incl_tax }} {{ order.currency }}
      </li>
    </ul>
  </div>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ModalMessage from '../ModalMessage.vue'

// Reactive variable to store orders
const orders = ref([])

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

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No token found. User is probably not logged in.')
    }

    const response = await axios.get('https://api.defonix.com/api/orders/', {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      }
    })

    console.log('Fetched orders:', response.data)
    orders.value = response.data  // ✅ Use the data directly
  } catch (error) {
    console.error('Error fetching orders:', error)
    showError("Failed to fetch orders: " + error.message, 'error', 'Fetch Error')
  }
})
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}

#orders {
  padding: 1rem;
  font-size: small;
}

ul{
  list-style: none;
}
</style>
