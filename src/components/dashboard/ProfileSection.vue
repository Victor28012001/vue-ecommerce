<template>
    <main class="main-content" v-if="user">
        <h2>Profile</h2>
        <div class="profile-header">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
        </div>

        <table class="profile-table">
            <tbody>
                <tr>
                    <th>Full Name</th>
                    <td>{{ user.name }}</td>
                </tr>
                <tr>
                    <th>Email Address</th>
                    <td>{{ user.email }}</td>
                </tr>
                <tr>
                    <th>Date Registered</th>
                    <td>{{ user.registeredAt }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>


<!-- <script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)

const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found. User is probably not logged in.');
        }

        const response = await axios.get('https://api.defonix.com/api/users/3/', {
            headers: {
                Authorization: `Token ${token}`,  // 👈 Add the token here
                Accept: 'application/json',
            },
        });

        const data = response.data;
        console.log(data);

        user.value = {
            name: data.username,
            email: data.email,
            registeredAt: new Date(data.date_joined).toLocaleString(),
        };
    } catch (err) {
        console.error('Failed to fetch user profile:', err);
    }
};


onMounted(() => {
    fetchUserProfile()
})
</script> -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)

const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found.')

        // Step 1: Get basket
        const basketRes = await axios.get('https://api.defonix.com/api/basket/', {
            headers: {
                Authorization: `Token ${token}`,
                Accept: 'application/json',
            },
        })

        const basket = basketRes.data
        const ownerUrl = basket.owner

        // Step 2: Fetch user from basket.owner
        const userRes = await axios.get(ownerUrl, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: 'application/json',
            },
        })

        const data = userRes.data
        console.log('User:', data)

        // Step 3: Set user state
        user.value = {
            name: data.username,
            email: data.email,
            registeredAt: new Date(data.date_joined).toLocaleString(),
        }
    } catch (err) {
        console.error('Failed to fetch user profile:', err)
    }
}

onMounted(() => {
    fetchUserProfile()
})
</script>



<style scoped>
:root {
    --dark-blue: #0b1e3f;
    --dim-white: #f2f3f5;
    --text-color: #fff;
}

.main-content {
    flex: 1;
    padding: 2rem;
    background-color: var(--dim-white);
}

.profile-header {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.profile-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}

.profile-table th,
.profile-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    background-color: #224893;
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    border-radius: 5px;
}

.btn.danger {
    background-color: #c62828;
}

/* Responsive layout */
@media (max-width: 768px) {
    .dashboard-body {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        display: flex;
        overflow-x: auto;
    }

    .sidebar ul {
        display: flex;
        gap: 1rem;
    }

    .sidebar li {
        margin-bottom: 0;
    }

    .main-content {
        padding: 1rem;
        font-size: x-small;
    }
}
</style>
