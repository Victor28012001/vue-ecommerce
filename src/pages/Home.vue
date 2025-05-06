<template>
    <div class="home">
        <Navbar />
        <HeroSection />
        <!-- <div class="p-4 text-gray-500">Select a category to view products.</div> -->
        <TopCategory :categories="categories" />
        <!-- <CategorySelector :categories="categories" @select="handleCategory" /> -->
        <!-- <FilterPanel @filter-changed="applyFilters" /> -->
        <!-- <SortOptions @sort-changed="sortProducts" /> -->
        <FeaturedProducts :products="filteredProducts" @add-to-cart="addToCart" />
        <ServicesSection />
        <!-- <Paginator :page="page" @change="changePage" /> -->
        <!-- <OrderSummary :cart="cart" /> -->
        <!-- <Wishlist :items="wishlist" @remove="removeFromWishlist" /> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import TopCategory from "../components/TopCategory.vue";
import ServicesSection from '../components/ServicesSection.vue'
import CategorySelector from '../components/CategorySelector.vue'
import FilterPanel from '../components/FilterPanel.vue'
import SortOptions from '../components/SortOptions.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import Paginator from '../components/Paginator.vue'
import OrderSummary from '../components/OrderSummary.vue'
import Wishlist from '../components/Wishlist.vue'
import Footer from '../components/Footer.vue'

const categories = [
  { name: 'Laptops', image: 'cat.png', count: 34 },
  { name: 'Desktops', image: 'cat.png', count: 21 },
  { name: 'Printers', image: 'cat.png', count: 12 },
  { name: 'Monitors', image: 'cat.png', count: 15 },
  { name: 'Phones', image: 'cat.png', count: 45 },
  { name: 'Accessories', image: 'cat.png', count: 28 }
];
const products = ref([...Array(10)].map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    image: `https://via.placeholder.com/150`,
    inWishlist: false
})))
const filteredProducts = ref(products.value)
const cart = ref([])
const wishlist = ref([])
const page = ref(1)

function handleCategory(category) {
    filteredProducts.value = products.value.filter(p => category === 'All' || p.name.includes(category))
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