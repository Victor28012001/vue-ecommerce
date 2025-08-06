<template>
  <div style="padding: 1rem;">
    <h2>User Addresses</h2>

    <p v-if="addresses.length === 0">No addresses found.</p>
    <ul v-else>
      <li v-for="address in addresses" :key="address.id">
        <strong>{{ address.first_name }} {{ address.last_name }}</strong><br>
        {{ address.line1 }}, {{ address.line2 }}<br>
        {{ address.state }}, {{ address.postcode }}<br>
        {{ getCountryName(address.country) }}<br>
        <button @click="openEditModal(address)">Edit</button>
        <button id="delete" @click="deleteAddress(address.id)">Delete</button>
      </li>
    </ul>

    <button @click="openAddModal">Add New Address</button>


    <!-- Modal -->
    <transition name="fade">
      <div v-if="showModals" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <h3>{{ isEditing ? 'Edit Address' : 'Add Address' }}</h3>
          <form @submit.prevent="submitForm">
            <select v-model="form.title">
              <option disabled value="">-- Select Title (Mr/Ms) --</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
            </select>
            <input v-model="form.first_name" placeholder="First Name" />
            <input v-model="form.last_name" placeholder="Last Name" />
            <input v-model="form.line1" placeholder="Line 1" />
            <input v-model="form.line2" placeholder="Line 2" />
            <input v-model="form.city" placeholder="City" />
            <input v-model="form.state" placeholder="State" />
            <input v-model="form.postcode" placeholder="Postcode" />

            <select v-model="form.country">
              <option disabled value="">-- Select Country --</option>
              <option v-for="country in countries" :key="country.url" :value="country.url">
                {{ country.printable_name }}
              </option>
            </select>
            <span v-if="formErrors.country" class="error">{{ formErrors.country[0] }}</span>

            <input v-model="form.phone_number" placeholder="Phone Number" />
            <span v-if="formErrors.phone_number" class="error">{{ formErrors.phone_number[0] }}</span>

            <textarea v-model="form.notes" placeholder="Notes"></textarea>

            <label>
              <input type="checkbox" v-model="form.is_default_for_shipping" />
              Default Shipping
            </label>
            <label>
              <input type="checkbox" v-model="form.is_default_for_billing" />
              Default Billing
            </label>

            <div class="actions">
              <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
              <button type="button" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import ModalMessage from '../ModalMessage.vue'

const addresses = ref([])
const countries = ref([])
const showModals = ref(false)
const isEditing = ref(false)
const currentId = ref(null)
const formErrors = ref({})

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

// Reactive form state
const form = reactive({
  title: '',
  first_name: '',
  last_name: '',
  line1: '',
  line2: '',
  line3: '',
  line4: '',
  city: '',
  state: '',
  postcode: '',
  phone_number: '',
  notes: '',
  is_default_for_shipping: false,
  is_default_for_billing: false,
  country: ''
})

// Fetch countries from API
const loadCountries = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('https://api.defonix.com/api/countries/', {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json'
      }
    })
    countries.value = res.data
  } catch (err) {
    console.error('Failed to load countries:', err)
    showError("Failed to load countries: " + err.message, 'error', 'Country Error')
  }
}

// Get printable country name from URL
const getCountryName = (countryUrl) => {
  const match = countries.value.find(c => c.url === countryUrl)
  return match ? match.printable_name : countryUrl
}

// Fetch user addresses
const loadAddresses = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('https://api.defonix.com/api/useraddresses/', {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json'
      }
    })
    addresses.value = res.data
  } catch (err) {
    console.error('Failed to fetch addresses:', err)
    showError("Failed to fetch addresses: " + err.message, 'error', 'Address Error')
  }
}

// Reset form to empty state
const resetForm = () => {
  Object.assign(form, {
    title: '',
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    city: '',
    state: '',
    postcode: '',
    phone_number: '',
    notes: '',
    is_default_for_shipping: false,
    is_default_for_billing: false,
    country: ''
  })
  formErrors.value = {}
}

const openAddModal = () => {
  isEditing.value = false
  resetForm()
  showModals.value = true
}

const openEditModal = (address) => {
  isEditing.value = true
  currentId.value = address.id
  Object.assign(form, address)
  showModals.value = true
}

const closeModal = () => {
  showModals.value = false
  resetForm()
}

const submitForm = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = {
      Authorization: `Token ${token}`,
      Accept: 'application/json'
    }

    formErrors.value = {}

    // 🌍 Format phone number to E.164
    const countryCode = getCountryCodeFromUrl(form.country)
    const parsed = parsePhoneNumberFromString(form.phone_number, countryCode)

    if (!parsed || !parsed.isValid()) {
      throw { response: { data: { phone_number: ['Invalid phone number.'] } } }
    }

    form.phone_number = parsed.number

    if (isEditing.value) {
      await axios.patch(`https://api.defonix.com/api/useraddresses/${currentId.value}/`, form, { headers })
    } else {
      await axios.post('https://api.defonix.com/api/useraddresses/', form, { headers })
    }

    await loadAddresses()
    closeModal()
  } catch (err) {
    if (err.response && err.response.data) {
      formErrors.value = err.response.data
      console.error('Validation errors:', formErrors.value)
      showError("Validation errors: " + JSON.stringify(formErrors.value), 'error', 'Validation Error')
    } else {
      console.error('Unexpected error:', err)
      showError("Unexpected error: " + err.message, 'error', 'Submission Error')
    }
  }
}

const getCountryCodeFromUrl = (url) => {
  const match = url.match(/\/countries\/([A-Z]{2})\/?$/)
  return match ? match[1] : null
}


const deleteAddress = async (id) => {
  if (!confirm('Are you sure you want to delete this address?')) return

  try {
    const token = localStorage.getItem('token')
    await axios.delete(`https://api.defonix.com/api/useraddresses/${id}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    await loadAddresses()
  } catch (err) {
    console.error('Failed to delete address:', err)
    showError("Failed to delete address: " + err.message, 'error', 'Delete Error')
  }
}

onMounted(() => {
  loadAddresses()
  loadCountries()
})
</script>

<style scoped>
button {
  margin: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #1e90ff;
  color: white;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  height: 80%;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-content h3 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
}

/* Form elements */
.modal-content input,
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.modal-content input {
  width: -webkit-fill-available;
}

.modal-content textarea {
  min-height: 80px;
  resize: vertical;
  width: -webkit-fill-available;
}

.modal-content label {
  display: flex;
  margin-top: 10px;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
}

.modal-content label input {
  width: 10%;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.actions button {
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.actions button[type="submit"] {
  background-color: #1e90ff;
  color: white;
}

.actions button[type="button"] {
  background-color: #ccc;
  color: #333;
}

/* Simple fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}



.error {
  color: red;
  font-size: 0.9em;
  display: block;
  margin-top: -5px;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 10px;
}

li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#delete {
  background-color: red;
  color: white;
}

ul {
  list-style: none;
}
</style>
