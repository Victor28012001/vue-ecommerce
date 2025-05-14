<template>
    <div class="home">
        <Navbar />
        <HeroSection />
        <!-- <div class="p-4 text-gray-500">Select a category to view products.</div> -->
        <TopCategory v-if="categories.length" :categories="categories" @select="handleCategory" />
        <!-- <CategorySelector :categories="categories" @select="handleCategory" /> -->
        <FeaturedProducts v-if="filteredProducts.length" :products="filteredProducts" @add-to-cart="addToCart" />
        <div class="cta-layout">
            <Cta class="cta-large" title="Premium Laptops" tag="Limited Time Offer"
                paragraph="Up to 40% off on selected models. Powerful performance for work and play."
                :imageSrc="imgSrc" />

            <div class="cta-column">
                <Cta class="cta-small" title="Monitors" paragraph="20% off $5,000." :imageSrc="desktop" />
                <Cta class="cta-small" title="Accessories" paragraph="20% off $5,000." :imageSrc="accessories" />
            </div>
        </div>
        <ServicesSection />
        <!-- <OrderSummary :cart="cart" /> -->
        <!-- <Wishlist :items="wishlist" @remove="removeFromWishlist" /> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/Herosection.vue'
import TopCategory from "../components/TopCategory.vue";
import ServicesSection from '../components/ServicesSection.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import Cta from '../components/Cta.vue';
import OrderSummary from '../components/OrderSummary.vue'
import Wishlist from '../components/Wishlist.vue'
import imgSrc from "../assets/images/spec_offer.png"
import desktop from "../assets/images/desktop.png"
import accessories from "../assets/images/accessories.png"
import laptop from "../assets/images/laptop.jpg"
import desktop1 from "../assets/images/desktop.jpg"
import accessories1 from "../assets/images/accessories.jpg"
import printer from "../assets/images/printer.jpg"
import monitor from "../assets/images/monitor.jpg"
import phone from "../assets/images/phone.jpg"


const products = ref([])
const filteredProducts = ref([])
const categories = ref([]) // now dynamic
const cart = ref([])
const wishlist = ref([])
const page = ref(1)

// Helper: assign default image for categories
const getCategoryImage = (categoryName) => {
    const lower = categoryName.toLowerCase()
    if (lower.includes('laptop')) return laptop
    if (lower.includes('desktop')) return desktop1
    if (lower.includes('printer')) return printer
    if (lower.includes('monitor')) return monitor
    if (lower.includes('phone')) return phone
    if (lower.includes('accessor')) return accessories1
    return 'cat.png' // default fallback
}

// Load and process products
onMounted(async () => {
    const jsonData = await import('../assets/data/products.json')
    products.value = jsonData.default
    filteredProducts.value = products.value

    // Extract unique categories with count
    const categoryMap = {}
    products.value.forEach(p => {
        const cat = p.category || 'Uncategorized'
        if (!categoryMap[cat]) {
            categoryMap[cat] = { name: cat, image: getCategoryImage(cat), count: 0 }
        }
        categoryMap[cat].count++
    })

    categories.value = Object.values(categoryMap)
})

// Handlers
function handleCategory(category) {
    filteredProducts.value = products.value.filter(
        p => category === 'All' || p.category?.toLowerCase() === category.toLowerCase()
    )
}

function addToCart(product) {
    cart.value.push({ ...product, quantity: 1 })
}

function removeFromWishlist(id) {
    wishlist.value = wishlist.value.filter(item => item.id !== id)
}

function applyFilters(filters) {
    // Add actual filtering logic here
}

function sortProducts(type) {
    // Add actual sort logic here
}

function changePage(p) {
    page.value = p
}

</script>
<style scoped>
.cta-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 12px 4rem;
}

.cta-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Tablet/Desktop layout */
@media (min-width: 768px) {
    .cta-layout {
        flex-direction: row;
        padding: 12px 2rem;
    }

    .cta-large {
        flex: 2;
    }

    .cta-column {
        flex: 1;
        justify-content: space-between;
    }
}

.home{
    overflow-x: hidden;
}
</style>