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
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()


// Import external components
import ProfileSection from '../components/dashboard/ProfileSection.vue'
import OrderHistory from '../components/dashboard/OrderHistory.vue'
import AddressBook from '../components/dashboard/AddressBook.vue'
import EmailHistory from '../components/dashboard/EmailHistory.vue'
import ProductAlerts from '../components/dashboard/ProductAlerts.vue'
import Notifications from '../components/dashboard/Notifications.vue'
import WishLists from '../components/dashboard/WishLists.vue'
import Navbar from '../components/Navbar.vue'

const activeSection = ref('profile')

const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'orders', label: 'Order History' },
    { key: 'addresses', label: 'Address Book' },
    { key: 'emails', label: 'Email History' },
    { key: 'alerts', label: 'Product Alerts' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'wishlists', label: 'Wish Lists' },
]

const activeComponent = computed(() => {
    switch (activeSection.value) {
        case 'profile': return ProfileSection
        case 'orders': return OrderHistory
        case 'addresses': return AddressBook
        case 'emails': return EmailHistory
        case 'alerts': return ProductAlerts
        case 'notifications': return Notifications
        case 'wishlists': return WishLists
        default: return ProfileSection
    }
})

const activeSectionLabel = computed(() => {
    return menuItems.find(i => i.key === activeSection.value)?.label || ''
})

const logout = () => {
    localStorage.removeItem('token')
    router.push('/loginRegister')
}

onMounted(() => {
    const token = localStorage.getItem('token')
    //   if (!token) router.push('/loginRegister')
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
    }

    .nav-button {
        white-space: nowrap;
        flex-shrink: 0;
    }

    .main-content {
        padding: 1rem;
    }
}
</style>
