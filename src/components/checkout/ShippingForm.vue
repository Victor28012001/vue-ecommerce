<template>
  <div class="form-section table-cont">
    <h3>Shipping Information</h3>


    <div class="auto-fill-default" style="margin-bottom: 1em;">
      <input type="checkbox" id="useDefaultAddress" v-model="useDefaultAddress" />
      <label for="useDefaultAddress">Use my default shipping address</label>
    </div>

    <form @submit.prevent="submitCheckout">
      <!-- Row 1: First Name & Last Name -->
      <div class="row">
        <div class="col">
          <label for="firstName">First Name</label>
          <input id="firstName" type="text" @blur="validateFirstName" @input="validateFirstName"
            v-model="form.firstName" placeholder="John" required />
          <small v-if="errors.firstName" class="error">{{ errors.firstName }}</small>
        </div>
        <div class="col">
          <label for="lastName">Last Name</label>
          <input id="lastName" type="text" @blur="validateLastName" @input="validateLastName" v-model="form.lastName"
            placeholder="Doe" required />
          <small v-if="errors.lastName" class="error">{{ errors.lastName }}</small>
        </div>
      </div>

      <!-- Row 2: Address & Phone Number -->
      <div class="row">
        <div class="col">
          <label for="address">Address</label>
          <input id="address" type="text" @blur="validateAddress" @input="validateAddress" v-model="form.address"
            placeholder="542 W. 15th Street" required />
          <small v-if="errors.address" class="error">{{ errors.address }}</small>
        </div>
        <div class="col">
          <label for="phone">Phone Number</label>
          <input id="phone" type="text" @blur="validatePhone" @input="validatePhone" v-model="form.phone"
            placeholder="+234 812 345 6789" required />
          <small v-if="errors.phone" class="error">{{ errors.phone }}</small>
        </div>
      </div>

      <!-- Row 3: Email & Zip Code -->
      <div class="row">
        <div class="col">
          <label for="email">Email Address</label>
          <input id="email" type="email" @blur="validateEmail" @input="validateEmail" v-model="form.email"
            placeholder="john@example.com" required />
          <small v-if="errors.email" class="error">{{ errors.email }}</small>
        </div>
        <div class="col">
          <label for="zip">Zip/Postal Code</label>
          <input id="zip" type="text" @blur="validateZip" @input="validateZip" v-model="form.zip" placeholder="100001"
            required />
          <small v-if="errors.zip" class="error">{{ errors.zip }}</small>
        </div>
      </div>

      <!-- Row 4: State & City -->
      <div class="row">
        <div class="col">
          <label for="state">State</label>
          <select id="state" v-model="form.state" @change="fetchCities" required>
            <option disabled value="">Select a state</option>
            <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
          </select>
          <small v-if="errors.state" class="error">{{ errors.state }}</small>
        </div>
        <div class="col">
          <label for="city">City</label>
          <select id="city" v-model="form.city" :disabled="!cities.length" required>
            <option disabled value="">Select a city</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
          <small v-if="errors.city" class="error">{{ errors.city }}</small>
        </div>
      </div>
    </form>
  </div>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>


<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useCartStore } from '../../stores/cart';
import nigeriaData from "../../assets/data/statesAndCities.json"
import axios from 'axios'
import ModalMessage from '../ModalMessage.vue'

const cart = useCartStore();
const form = cart.shipping;
const defaultAddress = ref(null)
const useDefaultAddress = ref(false)

const errors = reactive({
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  email: '',
  zip: '',
  city: '',
  state: ''
});

const states = ref([]);
const cities = ref([]);

const fetchStates = () => {
  states.value = nigeriaData.map(entry => entry.state.name.trim());
};

const fetchCities = () => {
  const stateObj = nigeriaData.find(
    entry => entry.state.name.trim() === form.state.trim()
  );
  cities.value = stateObj ? stateObj.state.cities.map(c => c.name) : [];
  if (!cities.value.includes(form.city)) {
    form.city = '';
  }
};

onMounted(fetchStates);
watch(() => form.state, fetchCities);

const validateFirstName = () => {
  const val = form.firstName || '';
  errors.firstName = /^[a-zA-Z\s]+$/.test(val)
    ? ''
    : 'Only letters and spaces allowed.';
};
const validateLastName = () => {
  const val = form.lastName || '';
  errors.lastName = /^[a-zA-Z\s]+$/.test(val)
    ? ''
    : 'Only letters and spaces allowed.';
};
const validateAddress = () => {
  const val = form.address || '';
  errors.address = val.length >= 5
    ? ''
    : 'Address must be at least 5 characters.';
};
const validatePhone = () => {
  const val = form.phone || '';
  errors.phone = /^\+?\d{7,15}$/.test(val)
    ? ''
    : 'Invalid phone number.';
};
const validateEmail = () => {
  const val = form.email || '';
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    ? ''
    : 'Invalid email address.';
};
const validateZip = () => {
  const val = form.zip || '';
  errors.zip = /^[0-9]{4,10}$/.test(val)
    ? ''
    : 'Invalid ZIP/postal code.';
};
const validateForm = () => {
  validateFirstName();
  validateLastName();
  validateAddress();
  validatePhone();
  validateEmail();
  validateZip();
  errors.city = form.city ? '' : 'Please select a city.';
  errors.state = form.state ? '' : 'Please select a state.';
};

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

const submitCheckout = async () => {
  validateForm();

  const hasErrors = Object.values(errors).some((e) => e !== '');
  if (hasErrors) {
    showError("Please fix the highlighted errors before submitting the form.", 'error', 'Validation Error');
    return false;
  } else {
    console.log("Form is valid, proceeding with checkout...");
    return true; // Indicate success
  }
};

defineExpose({ submitCheckout });

async function fetchDefaultAddress() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await axios.get('https://api.defonix.com/api/useraddresses/', {
        headers: {
          Authorization: `Token ${token}`,
          Accept: 'application/json'
        }
      })
      defaultAddress.value = res.data.find(
        addr => addr.is_default_for_shipping || addr.is_default_for_billing
      ) || null
    }
  } catch (err) {
    console.error('Failed to fetch default user address', err)
    showError("Failed to fetch default address: " + err.message, 'error', 'Address Error')
  }
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

watch(useDefaultAddress, (checked) => {
  if (checked && defaultAddress.value) {
    form.firstName = capitalize(defaultAddress.value.first_name)
    form.lastName = capitalize(defaultAddress.value.last_name)
    form.address = defaultAddress.value.line1 || ''
    form.phone = defaultAddress.value.phone_number || ''
    form.zip = defaultAddress.value.postcode || ''
    form.state = capitalize(defaultAddress.value.state)
    fetchCities()
    form.city = '' // optionally map city if you have it from your API
    validateForm() // re-validate after autofill
  }
})

onMounted(() => {
  fetchStates()
  fetchDefaultAddress()
})

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

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
  text-align: left;
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.row {
  display: flex;
  gap: 15px;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.submit-button {
  margin-top: 20px;
  background-color: #224893;
  color: white;
  padding: 12px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #1b3a6e;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
  }
}

.error {
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.auto-fill-default {
  margin-bottom: 1em;
  display: flex;
  padding: 0 24px;
  gap: 12px;
  align-items: center;
}
</style>
