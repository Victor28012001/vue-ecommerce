<template>
    <div class="form-section table-cont">
        <h3>Payment</h3>
        <form @submit.prevent>
            <label>Name on Card</label>
            <input type="text" v-model="name" placeholder="John More Doe" @blur="validateName" />
            <small v-if="errors.name" class="error">{{ errors.name }}</small>

            <label>Credit Card Number</label>
            <input type="text" v-model="cardNumber" placeholder="1111-2222-3333-4444" @blur="validateCardNumber" />
            <small v-if="errors.cardNumber" class="error">{{ errors.cardNumber }}</small>

            <div class="row">
                <div class="col">
                    <label>Expiration Date</label>
                    <input type="month" v-model="expiry" @blur="validateExpiry" />
                    <small v-if="errors.expiry" class="error">{{ errors.expiry }}</small>
                </div>

                <div class="col">
                    <label>CVV</label>
                    <input type="text" v-model="cvv" placeholder="123" @blur="validateCVV" />
                    <small v-if="errors.cvv" class="error">{{ errors.cvv }}</small>
                </div>
            </div>

            <label>
                <input type="checkbox" v-model="saveInfo" /> Save my Information for faster checkout
            </label>
        </form>
    </div>
</template>


<script setup>
import { ref } from 'vue'

const name = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const saveInfo = ref(true)

const errors = ref({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
})

const validateName = () => {
    errors.value.name = /^[a-zA-Z\s]+$/.test(name.value)
        ? ''
        : 'Name must contain only letters and spaces'
}

const validateCardNumber = () => {
    errors.value.cardNumber = /^(?:\d{4}[-\s]?){3}\d{4}$/.test(cardNumber.value)
        ? ''
        : 'Card number must be 16 digits in format XXXX-XXXX-XXXX-XXXX'
}

const validateExpiry = () => {
    if (!expiry.value) {
        errors.value.expiry = 'Expiration date is required'
        return
    }

    const [year, month] = expiry.value.split('-').map(Number)
    const today = new Date()
    const expDate = new Date(year, month)

    errors.value.expiry = expDate > today
        ? ''
        : 'Expiration date must be in the future'
}

const validateCVV = () => {
    errors.value.cvv = /^\d{3,4}$/.test(cvv.value)
        ? ''
        : 'CVV must be 3 or 4 digits'
}
</script>


<style scoped>
.form-section {
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.table-cont {
    overflow: auto;
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
</style>
