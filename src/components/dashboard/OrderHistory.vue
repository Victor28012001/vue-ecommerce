<template>
  <div>
    <h2>Order History</h2>
    <p v-if="orders.length === 0">No orders found.</p>
    <ul v-else>
      <li v-for="order in orders" :key="order.number">
        Order #{{ order.number }} - {{ order.status }} - {{ order.total_incl_tax }} {{ order.currency }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reactive variable to store orders
const orders = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. User is probably not logged in.');
    }

    const response = await axios.get('https://api.defonix.com/api/orders/', {
      headers: {
        Authorization: `Token ${token}`,  // 👈 Add the token here
        Accept: 'application/json',
      }
    })

    if (!response.ok) throw new Error('Failed to fetch orders')

    const data = await response.json()
    console.log(data)
    orders.value = data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
})
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}
</style>
