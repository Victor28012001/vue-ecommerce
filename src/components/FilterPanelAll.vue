<template>
    <div class="filter-panel">
        <div class="h4">
            <h4>Filters</h4>
            <span @click="resetFilters">Reset All</span>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-range">
            <label>Price Range</label>
            <div class="slider-container">
                <div class="slider">
                    <div class="price-slider" :style="sliderStyle"></div>
                </div>
                <div class="range-input">
                    <input type="range" class="min-range" :min="minLimit" :max="maxLimit" v-model="tempMinPrice" />
                    <input type="range" class="max-range" :min="minLimit" :max="maxLimit" v-model="tempMaxPrice" />
                </div>
            </div>
            <div class="flex  items-center gap-4 flex1">
                <input type="number" v-model.number="tempMinPrice" :min="minLimit" :max="maxPrice"
                    class="input-number" />
                <input type="number" v-model.number="tempMaxPrice" :min="minPrice" :max="maxLimit"
                    class="input-number" />
            </div>
        </div>

        <!-- Category Filter -->
        <div class="cate">
            <label class="checkbox-label">By Categories</label>
            <div v-for="c in uniqueCategories" :key="c" class="flex items-center gap-2">
                <input type="checkbox" :value="c" v-model="tempSelectedCategories" :id="`cat-${c}`" />
                <label :for="`cat-${c}`">{{ c }}</label>
            </div>
        </div>


        <!-- Brand Filter -->
        <div class="cate">
            <label class="checkbox-label">By Brands</label>
            <div v-for="b in uniqueBrands" :key="b" class="flex items-center gap-2">
                <input type="checkbox" :value="b" v-model="tempSelectedBrands" :id="`brand-${b}`" />
                <label :for="`brand-${b}`">{{ b }}</label>
            </div>
        </div>

        <!-- Reset Button -->
        <div class="reset-button-container">
            <button @click="resetFilters" class="reset-button">Reset</button>
            <button @click="applyFilters" class="apply-button">Apply Filters</button>
        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    products: Array,
    categories: Array,
    brands: Array
})

const emit = defineEmits(['filter-changed'])

// Limits and initial states
const minLimit = 0
const maxLimit = 10000

const tempMinPrice = ref(minLimit)
const tempMaxPrice = ref(maxLimit)

const tempSelectedBrands = ref([])
const tempSelectedUsages = ref([])
const tempSelectedCategories = ref([]) // ✅ ADD THIS

const minPrice = ref(minLimit)
const maxPrice = ref(maxLimit)

const selectedBrands = ref([])
const selectedUsages = ref([])
const selectedCategories = ref([]) // ✅ ADD THIS

// Unique filters
const uniqueCategories = computed(() => {
    const cats = new Set()
    props.products.forEach(p => p.category && cats.add(p.category))
    return Array.from(cats)
})

const uniqueBrands = computed(() => props.brands)


// Slider style
const sliderStyle = computed(() => {
    const left = (tempMinPrice.value / maxLimit) * 100
    const right = 100 - (tempMaxPrice.value / maxLimit) * 100
    return {
        left: `${left}%`,
        right: `${right}%`
    }
})

// Reset filters
function resetFilters() {
    minPrice.value = minLimit
    maxPrice.value = maxLimit

    selectedBrands.value = []
    selectedUsages.value = []
    selectedCategories.value = []

    tempMinPrice.value = minLimit
    tempMaxPrice.value = maxLimit
    tempSelectedBrands.value = []
    tempSelectedUsages.value = []
    tempSelectedCategories.value = []

    emit('filter-changed', {
        price: { min: minPrice.value, max: maxPrice.value },
        brands: [],
        usages: [],
        categories: []
    })
}

// Apply filters
function applyFilters() {
    minPrice.value = tempMinPrice.value
    maxPrice.value = tempMaxPrice.value

    selectedBrands.value = [...tempSelectedBrands.value]
    selectedUsages.value = [...tempSelectedUsages.value]
    selectedCategories.value = [...tempSelectedCategories.value]

    emit('filter-changed', {
        price: { min: minPrice.value, max: maxPrice.value },
        brands: selectedBrands.value,
        usages: selectedUsages.value,
        categories: selectedCategories.value
    })
}

// Emit when values change
watch([minPrice, maxPrice, selectedBrands, selectedUsages, selectedCategories], () => {
    emit('filter-changed', {
        price: { min: minPrice.value, max: maxPrice.value },
        brands: selectedBrands.value,
        usages: selectedUsages.value,
        categories: selectedCategories.value 
    })
})
</script>


<style scoped>
/* Filter Panel Styles */
.filter-panel {
    border-radius: 8px;
    margin: auto auto;
}

.filter-panel h4 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
    margin-top: 0;
}

.filter-panel .flex {
    display: flex;
}

.filter-panel .gap-4 {
    gap: 1rem;
}

.filter-panel label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.filter-panel .filter-range {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 24px 12px 0;
    box-sizing: border-box;
    border-bottom: 1px #f0f0f0 solid;
}

.filter-panel .input-number {
    width: 80px;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.filter-panel .slider-container {
    width: 100%;
    height: 4px;
    position: relative;
    background: #e4e4e4;
    border-radius: 5px;
}

.filter-panel .flex.items-center {
    align-items: center;
}

.filter-panel .gap-2 {
    gap: 0.5rem;
}

.filter-panel .checkbox-label {
    display: inline-block;
    margin-bottom: 4px;
    font-size: 0.9rem;
}

.filter-panel input[type="checkbox"] {
    accent-color: #007bff;
    margin-right: 8px;
}

.flex1 {
    justify-content: space-between;
    width: 100%;
    padding: 12px 0;
}

.cate {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 24px 0;
    border-bottom: 1px #f0f0f0 solid;
}

.filter-panel input[type="checkbox"]:focus {
    outline: none;
}

/* Reset Button */
.reset-button-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    flex-direction: row-reverse;

}

.reset-button {
    border: 1px solid #1c3c78;
    color: #1c3c78;
    background-color: transparent;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
}

.reset-button:hover {
    background-color: #1c3c78;
    color: white;
}

/* Media Query for larger screens */
@media (min-width: 768px) {
    .filter-panel {
        max-width: 400px;
    }
}

.slider {
    width: 100%;
}

.slider {
    height: 4px;
    position: relative;
    background: #e4e4e4;
    border-radius: 5px;
}

.slider .price-slider {
    height: 4px;
    left: 25%;
    right: 15%;
    position: absolute;
    border-radius: 5px;
    background: #224893;
}

.range-input {
    position: relative;
}

.range-input input {
    position: absolute;
    width: 100%;
    height: 5px;
    background: none;
    top: -5px;
    pointer-events: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
}

/* Styles for the range thumb in WebKit browsers */
input[type="range"]::-webkit-slider-thumb {
    height: 24px;
    width: 24px;
    border-radius: 70%;
    background: white;
    border: #224893 3px solid;
    pointer-events: auto;
    -webkit-appearance: none;
}

.h4 {
    display: flex;
    justify-content: space-between;
}

.h4 span {
    cursor: pointer;
    font-size: medium;
    color: #224893;
}

.apply-button {
    background-color: #224893;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
}

.apply-button:hover {
    background-color: #1c3c78;
}
</style>
