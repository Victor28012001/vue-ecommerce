<template>
  <div>
    <Navbar />

    <HeroCategory :background="Bg" :title="`Shop The Best ${categoryParam}`"
      description="Discover premium tech products with flexible payment options." />

    <div class="layout">
      <div class="top">
        <!-- Show filter-toggle on mobile -->
        <button v-if="!isDesktop" class="filter-toggle" @click="showFilter = !showFilter">
          FILTER
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
          </svg>
        </button>

        <!-- Show SortOptions with usage filters only on desktop -->
        <SortOptions :usageTypes="uniqueUsages" :isDesktop="isDesktop" @sort-changed="handleSortChange"
          @usage-changed="handleUsageChange" />


      </div>

      <div class="bottom">
        <!-- Filter Panel: Always visible on desktop, toggleable on mobile -->
        <div :class="['filter-panel-wrapper', { open: showFilter }]">
          <FilterPanel :products="categoryProducts" :usages="categoryUsages" :brands="categoryBrands"
            @filter-changed="handleFilterChange" />
        </div>

        <!-- Backdrop (only for mobile) -->
        <div v-if="showFilter" class="backdrop" @click="showFilter = false"></div>

        <!-- Products Section -->
        <div class="product">
          <div class="product-grid">
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
          </div>
          <Paginator :page="currentPage" :total-pages="totalPages" @change="handlePageChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import HeroCategory from '../components/HeroCategory.vue'
import ProductCard from '../components/ProductCard.vue'
import FilterPanel from '../components/FilterPanel.vue'
import SortOptions from '../components/SortOptions.vue'
import Paginator from '../components/Paginator.vue'
import Bg from '../assets/images/Bg1.png'
const isDesktop = ref(window.innerWidth >= 768)



// Route param
const route = useRoute()
const categoryParam = computed(() => route.params.name || 'Category')

// State
const showFilter = ref(false)
const products = ref([])
const filteredProducts = ref([])
const categories = ref([])

function getCategoryImage(cat) {
  return `${cat.toLowerCase().replace(/\s+/g, '-')}.png`
}

// Load data
onMounted(async () => {
  const jsonData = await import('../assets/data/products.json')
  products.value = jsonData.default

  const categoryMap = {}
  products.value.forEach(p => {
    const cat = p.category || 'Uncategorized'
    if (!categoryMap[cat]) {
      categoryMap[cat] = { name: cat, image: getCategoryImage(cat), count: 0 }
    }
    categoryMap[cat].count++
  })

  categories.value = Object.values(categoryMap)
  filteredProducts.value = categoryProducts.value

  // Auto set filter panel visibility based on screen size
  const handleResize = () => {
    isDesktop.value = window.innerWidth >= 768
    showFilter.value = isDesktop.value
  }
  window.addEventListener('resize', handleResize)
  handleResize()
})

const categoryProducts = computed(() =>
  products.value.filter(p =>
    p.category?.toLowerCase() === categoryParam.value.toLowerCase()
  )
)

const categoryUsages = computed(() => {
  const usages = new Set()
  categoryProducts.value.forEach(p => {
    if (p.use) usages.add(p.use)
  })
  return Array.from(usages)
})

const categoryBrands = computed(() => {
  const brands = new Set()
  categoryProducts.value.forEach(p => {
    if (p.brand) brands.add(p.brand)
  })
  return Array.from(brands)
})

const activeFilters = ref({
  price: { min: 0, max: Infinity },
  brands: [],
  usages: []
})

const sortOrder = ref('featured')
const selectedUsage = ref(null)

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
  activeFilters.value.usages = usage ? [usage] : [] // <-- Fix here
  applyFilters()
}


function applyFilters() {
  filteredProducts.value = products.value
    .filter(p => {
      const matchesCategory = p.category?.toLowerCase() === categoryParam.value.toLowerCase()
      const price = p.new_price || 0
      const matchesPrice = price >= activeFilters.value.price.min && price <= activeFilters.value.price.max
      const matchesBrand = !activeFilters.value.brands?.length || activeFilters.value.brands.includes(p.brand)
      const matchesUsage = !activeFilters.value.usages?.length || activeFilters.value.usages.includes(p.use)

      return matchesCategory && matchesPrice && matchesBrand && matchesUsage
    })
    .sort((a, b) => {
      if (sortOrder.value === 'price-asc') return (a.new_price || 0) - (b.new_price || 0)
      if (sortOrder.value === 'price-desc') return (b.new_price || 0) - (a.new_price || 0)
      return 0
    })
}

const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

function handlePageChange(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const uniqueUsages = computed(() => Array.from(new Set(categoryProducts.value.map(p => p.use)).values()))
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
  grid-template-columns: repeat(1, 1fr);
  margin-bottom: 12px;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
