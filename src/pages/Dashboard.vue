<template>
    <div class="dashboard">
        <Navbar :customLabel="activeSectionLabel" />

        <!-- Dashboard Layout -->
        <div class="dashboard-body">
            <!-- Sidebar -->
            <aside class="sidebar">
                <ul class="nav">
                    <li v-for="item in menuItems" :key="item.key">
                        <button class="nav-button" :class="{ active: activeSection === item.key }"
                            @click="activeSection = item.key">
                            {{ item.label }}
                        </button>
                    </li>
                    <li><button class="logout nav-button" @click.prevent="logout">Logout</button></li>
                </ul>
            </aside>

            <main class="main-content">
                <component :is="activeComponent" />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()


// Import external components
import ProfileSection from '../components/dashboard/ProfileSection.vue'
import OrderHistory from '../components/dashboard/OrderHistory.vue'
import AddressBook from '../components/dashboard/AddressBook.vue'
import Navbar from '../components/Navbar.vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const activeSection = ref('profile')

const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'orders', label: 'Order History' },
    { key: 'addresses', label: 'Address Book' },
]

const activeComponent = computed(() => {
    switch (activeSection.value) {
        case 'profile': return ProfileSection
        case 'orders': return OrderHistory
        case 'addresses': return AddressBook
        default: return ProfileSection
    }
})

const activeSectionLabel = computed(() => {
    return menuItems.find(i => i.key === activeSection.value)?.label || ''
})


const logout = async () => {
  try {
    await axios.delete('https://api.defonix.com/api/login/')

    // Clear tokens and cart
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/;'

    cart.clearCart()
    auth.setLoggedIn(false)  // ✅ Update global login state

    router.push('/loginRegister')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}



onMounted(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/loginRegister')
})

</script>

<style scoped>
:root {
    --dark-blue: #224893;
    --dim-white: #f2f3f5;
    --text-color: #fff;
}

.dashboard {
    background-color: var(--dim-white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    background-color: var(--dark-blue);
    color: var(--text-color);
    padding: 1rem;
}

.breadcrumb {
    font-size: 0.95rem;
}

.breadcrumb a {
    color: #9bbaff;
    text-decoration: none;
}

.dashboard-body {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    min-height: 0;
    padding: 24px 4rem;
}

.sidebar {
    background-color: var(--dark-blue);
    color: var(--text-color);
    width: 220px;
    padding: 1rem 0;
    flex-shrink: 0;
}

.nav {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-button {
    background: none;
    border: none;
    color: var(--text-color);
    padding: 0.75rem;
    width: 100%;
    text-align: left;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    transition: background 0.3s;
    font-size: 1rem;
}

.nav-button:hover,
.nav-button.active {
    background-color: #224893;
    color: #ffffff;
}

.main-content {
    padding: 2rem;
    flex-grow: 1;
    background-color: #ffffff;
    overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-body {
        flex-direction: column;
        padding: 0;
    }

    .sidebar {
        width: 100%;
        display: flex;
        overflow-x: auto;
        padding: 0.5rem;
        background-color: var(--dark-blue);
    }

    .nav {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        width: 100%;
        padding: 1rem;
    }

    .nav-button {
        white-space: nowrap;
        font-size: small;
        margin: 0;
        padding: 0.5rem;
    }

    .main-content {
        padding: 1rem;
    }
}
</style>
