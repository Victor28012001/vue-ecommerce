<template>
    <div class="form-section table-cont">
        <h3>Shipping Information</h3>
        <form @submit.prevent>

            <!-- Row 1: First Name & Last Name -->
            <div class="row">
                <div class="col">
                    <label for="firstName">First Name</label>
                    <input id="firstName" type="text" v-model="form.firstName" placeholder="John" required />
                </div>
                <div class="col">
                    <label for="lastName">Last Name</label>
                    <input id="lastName" type="text" v-model="form.lastName" placeholder="Doe" required />
                </div>
            </div>

            <!-- Row 2: Address & Phone Number -->
            <div class="row">
                <div class="col">
                    <label for="address">Address</label>
                    <input id="address" type="text" v-model="form.address" placeholder="542 W. 15th Street" required />
                </div>
                <div class="col">
                    <label for="phone">Phone Number</label>
                    <input id="phone" type="text" v-model="form.phone" placeholder="+1 123 456 7890" required />
                </div>
            </div>

            <!-- Row 3: Email & Zip Code -->
            <div class="row">
                <div class="col">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" v-model="form.email" placeholder="john@example.com" required />
                </div>
                <div class="col">
                    <label for="zip">Zip/Postal Code</label>
                    <input id="zip" type="text" v-model="form.zip" placeholder="10001" required />
                </div>
            </div>

            <!-- Row 4: City & State -->
            <div class="row">
                <div class="col">
                    <label for="city">City</label>
                    <select id="city" v-model="form.city" required>
                        <option disabled value="">Select a city</option>
                        <option>New York</option>
                        <option>Los Angeles</option>
                        <option>Chicago</option>
                        <option>San Francisco</option>
                    </select>
                </div>
                <div class="col">
                    <label for="state">State/Province</label>
                    <select id="state" v-model="form.state" required>
                        <option disabled value="">Select a state</option>
                        <option>California</option>
                        <option>New York</option>
                        <option>Illinois</option>
                        <option>Texas</option>
                    </select>
                </div>
            </div>

        </form>
    </div>
</template>


<script setup>
import { useCartStore } from '../../stores/cart';

const cart = useCartStore()
const form = cart.shipping

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
</style>
