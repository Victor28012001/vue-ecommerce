<template>
  <div>
    <Navbar />

    <HeroCategory :background="Bg" :title="`Shop The Best ${categoryParam}`"
      description="Discover premium tech products with flexible payment options." />

    <div class="layout">
      <div class="top">
        <button class="filter-toggle" @click="showFilter = !showFilter">
          ☰ Filters
        </button>

        <SortOptions :usageTypes="uniqueUsages" @sort-changed="handleSortChange" @usage-changed="handleUsageChange" />
      </div>
      <div class="bottom">
        <!-- Slide-in Filter Panel -->
        <div :class="['mobile-filter', { open: showFilter }]">
          <FilterPanel :products="categoryProducts" :usages="categoryUsages" :brands="categoryBrands"
            @filter-changed="handleFilterChange" />
        </div>

        <!-- Overlay behind filter (on mobile) -->
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

// Route param
const route = useRoute()
const categoryParam = computed(() => route.params.name || 'Category')

// State
const showFilter = ref(false)
const products = ref([])
const filteredProducts = ref([])  // Initially will show all products
const categories = ref([])

// Helper: Convert category name to image filename
function getCategoryImage(cat) {
  return `${cat.toLowerCase().replace(/\s+/g, '-')}.png`
}

// Load data
onMounted(async () => {
  const jsonData = await import('../assets/data/products.json')
  products.value = jsonData.default

  // Extract unique categories with image and count
  const categoryMap = {}
  products.value.forEach(p => {
    const cat = p.category || 'Uncategorized'
    if (!categoryMap[cat]) {
      categoryMap[cat] = { name: cat, image: getCategoryImage(cat), count: 0 }
    }
    categoryMap[cat].count++
  })

  categories.value = Object.values(categoryMap)

  // Set filteredProducts to all products of the selected category initially
  filteredProducts.value = categoryProducts.value
})

// Products filtered by current category
const categoryProducts = computed(() =>
  products.value.filter(p => p.category?.toLowerCase() === categoryParam.value.toLowerCase())
)

// Unique `use` values for the current category
const categoryUsages = computed(() => {
  const usages = new Set()
  categoryProducts.value.forEach(p => {
    if (p.use) usages.add(p.use)
  })
  return Array.from(usages)
})

// Unique `brand` values for the current category
const categoryBrands = computed(() => {
  const brands = new Set()
  categoryProducts.value.forEach(p => {
    if (p.brand) brands.add(p.brand)
  })
  return Array.from(brands)
})

// Filters
const activeFilters = ref({ price: 500, brands: '' })
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
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Optional: scroll to top
  }
}
</script>



<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bottom {
  display: flex;
  width: 100%;
  position: relative;
}

/* Filter Panel (hidden by default on mobile) */
.mobile-filter {
  display: none;
}

@media (max-width: 767px) {
  .mobile-filter {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 90%;
    max-width: 450px;
    height: 100vh;
    background: white;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 12px;
  }

  .mobile-filter.open {
    transform: translateX(0);
  }

  .product {
    width: 100%;
  }

  .filter-toggle {
    display: inline-block;
    margin: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: black;
    border: none;
    border-radius: 0.25rem;
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
}

/* Product Section (desktop) */
.product {
  display: flex;
  flex-direction: column;
  /* width: 80%; */
  align-items: center;
}

/* Grid */
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

  .mobile-filter,
  .filter-toggle,
  .backdrop {
    display: none;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
