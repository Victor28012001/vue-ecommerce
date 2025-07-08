<template>
  <div>
    <Navbar />

    <HeroCategory :background="getCategoryImage(categoryParam)" :title="`Shop The Best ${categoryParam}`"
      description="Discover premium tech products with flexible payment options." />

    <div class="layout">
      <div class="top">
        <!-- Mobile filter toggle -->
        <button v-if="!isDesktop" class="filter-toggle" @click="showFilter = !showFilter">
          FILTER
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75…" />
          </svg>
        </button>

        <!-- Desktop sort & usage -->
        <SortOptions :usageTypes="uniqueUsages" :isDesktop="isDesktop" @sort-changed="handleSortChange"
          @usage-changed="handleUsageChange" />
      </div>

      <div class="bottom">
        <!-- Filter panel -->
        <div :class="['filter-panel-wrapper', { open: showFilter }]">
          <FilterPanel :products="categoryProducts" :usages="categoryUsages" :brands="categoryBrands"
            @filter-changed="handleFilterChange" />
        </div>

        <!-- Backdrop for mobile -->
        <div v-if="showFilter" class="backdrop" @click="showFilter = false"></div>

        <!-- Products grid -->
        <div class="product">
          <div class="product-grid">
            <!-- <p>Rendering {{ paginatedProducts.length }} products</p> -->
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
          </div>
          <Paginator :page="currentPage" :total-pages="totalPages" @change="handlePageChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Navbar from '../components/Navbar.vue'
import HeroCategory from '../components/HeroCategory.vue'
import ProductCard from '../components/ProductCard.vue'
import FilterPanel from '../components/FilterPanel.vue'
import SortOptions from '../components/SortOptions.vue'
import Paginator from '../components/Paginator.vue'

import Bg from '../assets/images/Bg1.png'
import Accessories from '../assets/images/BgAccessory.png'
import Laptops from '../assets/images/BgLaptop.png'
import Monitors from '../assets/images/BgMonitor.png'
import Phones from '../assets/images/BgPhone.png'
import Printers from '../assets/images/BgPrinter.png'
import Tablets from '../assets/images/BgTablet.png'

// Reactive state
const isDesktop = ref(window.innerWidth >= 768)
const showFilter = ref(isDesktop.value)

const products = ref([])
const filteredProducts = ref([])
const categories = ref([])

const route = useRoute()
const categoryParam = computed(() => route.params.name || 'Category')

// Filters & sorting
const activeFilters = ref({
  price: { min: 0, max: Infinity },
  brands: [],
  usages: []
})
const sortOrder = ref('featured')
const selectedUsage = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Resize handling
function setupResize() {
  const onResize = () => {
    isDesktop.value = window.innerWidth >= 768
    showFilter.value = isDesktop.value
  }
  window.addEventListener('resize', onResize)
  onResize()
}

// Normalize for matching
function normalize(str) {
  return str?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
}

// Explicit slug → category map
function slugToCategory(slug) {
  const map = {
    'laptops-desktops': 'Laptops & Desktops',
    'phone-accessories': 'Phone Accessories',
    'printers': 'Printers',
    'monitors': 'Monitors',
    'tablets': 'Tablets',
    'phones': 'Phones',
    'accessories': 'Accessories',
  }

  const mapped = map[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return mapped
}

const currentCategoryName = computed(() => slugToCategory(categoryParam.value))

// Category image helper
function getCategoryImage(categoryName) {
  const lower = categoryName.toLowerCase()
  if (lower.includes('laptop')) return Laptops
  if (lower.includes('tablet')) return Tablets
  if (lower.includes('printer')) return Printers
  if (lower.includes('monitor')) return Monitors
  if (lower.includes('phone')) return Phones
  if (lower.includes('accessor')) return Accessories
  return Bg
}

// Fetch and map products
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

        const product = {
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
          priceData: priceData || null,
          use: d.use,
          rating: d.rating
        }

        return product
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
      if (!map[cat]) map[cat] = { name: cat, image: getCategoryImage(cat), count: 0 }
      map[cat].count++
    })
    categories.value = Object.values(map)
  } catch (e) {
  }
}

// Computed sets
const categoryProducts = computed(() => {
  const category = currentCategoryName.value
  const matched = products.value.filter(p => normalize(p.category) === normalize(category))
  return matched
})

const categoryBrands = computed(() => {
  const brands = Array.from(new Set(categoryProducts.value.map(p => p.brand).filter(Boolean)))
  return brands
})

const categoryUsages = computed(() =>
  Array.from(new Set(categoryProducts.value.map(p => p.use).filter(Boolean)))
)

const uniqueUsages = computed(() => categoryUsages.value)

// Filter, sort, paginate
function applyFilters() {
  let list = categoryProducts.value

  list = list.filter(p => {
    const price = p.new_price || 0
    const byPrice = price >= activeFilters.value.price.min && price <= activeFilters.value.price.max
    const byBrand = !activeFilters.value.brands.length || activeFilters.value.brands.includes(p.brand)
    const byUsage = !activeFilters.value.usages.length || activeFilters.value.usages.includes(p.use)
    return byPrice && byBrand && byUsage
  })

  list.sort((a, b) => {
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

  filteredProducts.value = list
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

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const items = filteredProducts.value.slice(start, start + itemsPerPage)
  return items
})

function handlePageChange(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Init
onMounted(() => {
  fetchProducts()
  applyFilters()
  setupResize()
})

watch(categoryProducts, () => {
  applyFilters()
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

.product-grid[data-v-beeb9691] {
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr); /* Default: mobile */
  margin-bottom: 12px;
}

@media (min-width: 768px) and (max-width: 1127px) {
  .product-grid[data-v-beeb9691] {
    grid-template-columns: repeat(2, 1fr); /* Medium screens */
  }
}

@media (min-width: 1128px) {
  .product-grid[data-v-beeb9691] {
    grid-template-columns: repeat(3, 1fr); /* Large desktop */
  }
}
</style>
