<template>
    <div>
        <Navbar />

        <HeroCategory :background="Bg" title="All Products"
            description="Browse our complete collection of premium tech products. Use the filters to find exactly what you're looking for." />

        <div class="layout">
            <div class="top">
                <button v-if="!isDesktop" class="filter-toggle" @click="showFilter = !showFilter">
                    FILTER
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75…" />
                    </svg>
                </button>

                <SortOptions :usageTypes="uniqueUsages" :isDesktop="isDesktop" @sort-changed="handleSortChange"
                    @usage-changed="handleUsageChange" />
            </div>

            <div class="bottom">
                <div :class="['filter-panel-wrapper', { open: showFilter }]">
                    <FilterPanelAll :products="products" :categories="categories.map(c => c.name)"
                        :brands="categoryBrands" @filter-changed="handleFilterChange" />
                </div>

                <div v-if="showFilter" class="backdrop" @click="showFilter = false"></div>

                <div class="product">
                    <div class="product-grid">
                        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
                    </div>
                    <Paginator :page="currentPage" :total-pages="totalPages" @change="handlePageChange" />
                </div>
            </div>
        </div>
    </div>
  <ModalMessage v-if="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" :show="showModal"
    @close="showModal = false" />
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import Navbar from '../components/Navbar.vue'
import HeroCategory from '../components/HeroCategory.vue'
import ProductCard from '../components/ProductCard.vue'
import FilterPanelAll from '../components/FilterPanelAll.vue'
import SortOptions from '../components/SortOptions.vue'
import Paginator from '../components/Paginator.vue'
import ModalMessage from '../components/ModalMessage.vue'

import Bg from '../assets/images/BgAll.png'

// UI state
const isDesktop = ref(window.innerWidth >= 768)
const showFilter = ref(isDesktop.value)

const setupResize = () => {
    const onResize = () => {
        isDesktop.value = window.innerWidth >= 768
        showFilter.value = isDesktop.value
    }
    window.addEventListener('resize', onResize)
    onResize()
}

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

// Data state
const products = ref([])
const filteredProducts = ref([])
const categories = ref([])

// Filters
const activeFilters = ref({
    price: { min: 0, max: Infinity },
    brands: [],
    usages: [],
    categories: []
})
const sortOrder = ref('featured')
const selectedUsage = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Fetch products
async function fetchProducts() {
    try {
        const { data: productList } = await axios.get('https://api.defonix.com/api/products/')
        const detailed = await Promise.all(productList.map(async p => {
            try {
                const { data: d } = await axios.get(p.url)
                let priceData = null
                if (d.price) {
                    try {
                        const { data: pr } = await axios.get(d.price)
                        priceData = pr
                    } catch { }
                }

                const categoryStr = d.categories?.[0] || ''
                const [mainCategory, brandFromCategory] = categoryStr.split('>').map(s => s.trim())

                return {
                    id: d.id,
                    url: d.url,
                    stockrecords: d.stockrecords,
                    title: d.title,
                    description: d.description,
                    category: mainCategory || 'Uncategorized',
                    brand: d.brand || brandFromCategory || null,
                    image: d.images?.[0]?.original || 'https://dummyimage.com/1280x720/fff/aaa',
                    images: d.images?.map(img => img.original) || [],
                    old_price: null,
                    new_price: priceData ? parseFloat(priceData.incl_tax) : null,
                    currency: priceData?.currency || 'USD',
                    priceData,
                    use: d.use,
                    rating: d.rating
                }
            } catch {
                return null
            }
        }))

        products.value = detailed.filter(Boolean)
        filteredProducts.value = [...products.value]

        // Build categories list
        const map = {}
        products.value.forEach(p => {
            const cat = p.category
            if (!map[cat]) map[cat] = { name: cat, count: 0 }
            map[cat].count++
        })
        categories.value = Object.values(map)

        applyFilters()
    } catch (error) {
        console.error('Error loading products:', error)
        showError("Failed to load products: " + error.message, 'error', 'Fetch Error')
    }
}

// Computed filters
const categoryBrands = computed(() =>
    Array.from(new Set(products.value.map(p => p.brand).filter(Boolean)))
)

const uniqueUsages = computed(() =>
    Array.from(new Set(products.value.map(p => p.use).filter(Boolean)))
)

// Filtering
function applyFilters() {
    const { price, brands, usages, categories } = activeFilters.value

    let result = products.value.filter(p => {
        const matchesPrice = (p.new_price || 0) >= price.min && (p.new_price || 0) <= price.max
        const matchesBrand = !brands.length || brands.includes(p.brand)
        const matchesUsage = !usages.length || usages.includes(p.use)
        const matchesCategory = !categories.length || categories.includes(p.category)
        return matchesPrice && matchesBrand && matchesUsage && matchesCategory
    })

    result.sort((a, b) => {
        switch (sortOrder.value) {
            case 'price-asc': return (a.new_price || 0) - (b.new_price || 0)
            case 'price-desc': return (b.new_price || 0) - (a.new_price || 0)
            case 'rating': return (b.rating || 0) - (a.rating || 0)
            case 'newest': return b.id - a.id
            case 'title-a-z': return a.title.localeCompare(b.title)
            case 'title-z-a': return b.title.localeCompare(a.title)
            default: return 0
        }
    })

    filteredProducts.value = result
    currentPage.value = 1
}

function handleFilterChange(filters) {
    activeFilters.value = filters
    applyFilters()
}

function handleSortChange(order) {
    sortOrder.value = order
    applyFilters()
}

function handleUsageChange(usage) {
    selectedUsage.value = usage
    activeFilters.value.usages = usage ? [usage] : []
    applyFilters()
}

// Pagination
const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
})

function handlePageChange(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

// Init
onMounted(() => {
    setupResize()
    fetchProducts()
})
</script>




<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 4px;
}

.bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
}

@media (min-width: 768px) {
    .bottom {
        flex-direction: row;
        padding: 1rem 4rem;
        width: 100%;
        box-sizing: border-box;
    }
}

/* Filter Panel Wrapper */
.filter-panel-wrapper {
    display: none;
}

.filter-panel-wrapper.open {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 450px;
    height: 100vh;
    background: white;
    z-index: 50;
    overflow-y: auto;
    box-sizing: border-box;
    transition: transform 0.3s ease-in-out;
    padding: 10px 12px;
}

.filter-toggle {
    display: flex;
    margin: 1rem;
    background-color: transparent;
    color: black;
    border: none;
    width: 25%;
    align-items: center;
    font-size: large;
}

/* Always show filter panel on desktop */
@media (min-width: 768px) {
    .filter-panel-wrapper.open {
        display: block;
        position: relative;
        height: auto;
        box-shadow: none;
        width: 20%;
        padding: 0;
    }

    .top {
        padding: 0 4rem;
    }

    .filter-toggle {
        display: none;
    }

    .backdrop {
        display: none;
    }


    .product {
        width: 70%;
    }
}


.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 40;
}

.product {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    padding: 1rem;
    /* width: 70%; */
}

.product-grid {
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr); /* Default: mobile */
  margin-bottom: 12px;
}

@media (min-width: 768px) and (max-width: 1127px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr); /* Medium screens */
  }
}

@media (min-width: 1128px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr); /* Large desktop */
  }
}
</style>
