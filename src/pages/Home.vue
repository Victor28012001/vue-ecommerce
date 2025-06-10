<template>
    <div class="home">
        <Navbar />
        <HeroSection />
        <TopCategory v-if="categories.length" :categories="categories" @select="handleCategory" />
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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCartStore } from '../stores/cart'


import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/Herosection.vue'
import TopCategory from "../components/TopCategory.vue";
import ServicesSection from '../components/ServicesSection.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import Cta from '../components/Cta.vue';
import imgSrc from "../assets/images/spec_offer.png"
import desktop from "../assets/images/desktop.png"
import accessories from "../assets/images/accessories.png"
import laptop from "../assets/images/laptop.jpg"
import tablet from "../assets/images/desktop.jpg"
import accessories1 from "../assets/images/accessories.jpg"
import printer from "../assets/images/printer.jpg"
import monitor from "../assets/images/monitor.jpg"
import phone from "../assets/images/phone.jpg"


const products = ref([])
const filteredProducts = ref([])
const categories = ref([]) // now dynamic
const cart = useCartStore()

// Helper: assign default image for categories
const getCategoryImage = (categoryName) => {
    const lower = categoryName.toLowerCase()
    if (lower.includes('laptop')) return laptop
    if (lower.includes('tablet')) return tablet
    if (lower.includes('printer')) return printer
    if (lower.includes('monitor')) return monitor
    if (lower.includes('mobile')) return phone
    if (lower.includes('accessor')) return accessories1
    return 'cat.png' // default fallback
}


// Fetch all products and their details
async function fetchProducts() {
    try {
        // 1. Fetch list of product URLs + basic info
        const listRes = await axios.get('https://api.defonix.com/api/products/')
        const productList = listRes.data

        // 2. Fetch detailed info for each product in parallel
        const detailedProducts = await Promise.all(productList.map(async (prod) => {
            try {
                // Fetch product details for each product
                const detailRes = await axios.get(prod.url)
                const detailData = detailRes.data

                // Fetch price details too
                let priceData = null
                if (detailData.price) {
                    try {
                        const priceRes = await axios.get(detailData.price)
                        priceData = priceRes.data
                    } catch (e) {
                        console.warn(`Failed to fetch price for product ${detailData.id}`, e)
                    }
                }

                return {
                    ...detailData,
                    priceData, // attach price info
                }
            } catch (e) {
                console.warn(`Failed to fetch details for product ${prod.id}`, e)
                return null
            }
        }))


        // Filter out failed fetches (null)
        const validProducts = detailedProducts.filter(Boolean)

        // 3. Map products to your app's expected format
        products.value = validProducts.map(p => ({
            id: p.id,
            url: p.url, // ✅ ADD THIS
            stockrecords: p.stockrecords, // ✅ ADD THIS
            title: p.title,
            description: p.description,
            category: p.product_class || 'Uncategorized',
            images: p.images.length ? p.images.map(img => img.original) : [],
            image: p.images.length ? p.images[0].original : 'https://dummyimage.com/1280x720/fff/aaa',
            price: p.price ? p.price : null,
            old_price: null,
            new_price: p.priceData ? parseFloat(p.priceData.incl_tax) : null,
            currency: p.priceData ? p.priceData.currency : 'USD',
            priceData: p.priceData || null // ✅ INCLUDE THIS TOO
        }))


        filteredProducts.value = [...products.value]

        // 4. Extract unique categories for the category filter
        const categoryMap = {}
        products.value.forEach(p => {
            const cat = p.category || 'Uncategorized'
            if (!categoryMap[cat]) {
                categoryMap[cat] = { name: cat, image: getCategoryImage(cat), count: 0 }
            }
            categoryMap[cat].count++
        })
        categories.value = Object.values(categoryMap)

    } catch (error) {
        console.error('Failed to fetch products:', error)
    }
}

onMounted(() => {
    fetchProducts()
})



// Handlers
function handleCategory(category) {
    filteredProducts.value = products.value.filter(
        p => category === 'All' || p.category?.toLowerCase() === category.toLowerCase()
    )
}

import { v4 as uuidv4 } from 'uuid';

async function addToCart() {
    const product = props.product;

    if (!product?.url || !product?.stockrecords) {
        console.warn("Product is missing required fields:", product);
        return;
    }

    const productUrl = product.url;
    const stockrecordBase = typeof product.stockrecords === 'string'
        ? product.stockrecords
        : (Array.isArray(product.stockrecords) && product.stockrecords.length > 0
            ? product.stockrecords[0].url
            : null);

    const stockrecordUrl = stockrecordBase
        ? `${stockrecordBase}${product.id}/`
        : null;

    const quantity = 1;
    const priceCurrency = product.priceData?.currency || 'USD';
    const priceExclTax = parseFloat(product.priceData?.excl_tax ?? 0);
    const priceInclTax = parseFloat(product.priceData?.incl_tax ?? 0);

    if (!productUrl || !stockrecordUrl) {
        console.warn('Missing productUrl or stockrecordUrl');
        return;
    }

    const stockrecordId = stockrecordUrl.split('/').filter(Boolean).pop();

    // Ensure both product ID and stockrecordId are present
    let lineReference;
    if (product.id && stockrecordId) {
        lineReference = `prod-${product.id}-stock-${stockrecordId}`;
    } else {
        // fallback to a UUID if missing any part
        lineReference = `line-${uuidv4()}`;
    }

    // Check if the item already exists in the basket
    const existingItem = this.items.find(item => item.line_reference === lineReference);
    if (existingItem) {
        // Update the quantity of the existing item
        await cart.updateItemQuantity(existingItem.url, existingItem.quantity + quantity);
    } else {
        // Add new item to the basket
        await cart.addItem({
            product: productUrl,
            stockrecord: stockrecordUrl,
            quantity,
            price_currency: priceCurrency,
            price_excl_tax: priceExclTax,
            price_incl_tax: priceInclTax,
            line_reference: lineReference,
        });
    }
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

.home {
    overflow-x: hidden;
}
</style>