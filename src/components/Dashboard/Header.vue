<script setup>
import { useRouter } from 'vue-router';
import ThemeToggle from '../ThemeToggle.vue';
import { onMounted, ref } from 'vue';
import api from '@/services/api.js';
import { useToast } from 'vue-toastification';

const router = useRouter()
const user = ref({})
const isAccountListOpen = ref(false)
const isProfileModalOpen = ref(false)
const toast = useToast()

const emit = defineEmits(['toggle-nav', 'close'])

function toggleAccountList() {
    isAccountListOpen.value = !isAccountListOpen.value
}

function toggleProfileModal() {
    isProfileModalOpen.value = !isProfileModalOpen.value
}

onMounted(async () => {
    let storedUser = JSON.parse(localStorage.getItem('activeUser'))

    // If there's no activeUser but we have an access token, try to recover the user from the backend
    if (!storedUser) {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
                // backend might return user object directly or under data
                const fetchedUser = res.data?.data || res.data || null
                if (fetchedUser) {
                    localStorage.setItem('activeUser', JSON.stringify(fetchedUser))
                    storedUser = fetchedUser
                }
            } catch (err) {
                // couldn't recover user, fall through to redirect below
                console.warn('Failed to fetch active user from token:', err)
            }
        }
    }

    if (!storedUser) {
        router.push('/login')
        return
    }

    // Only enforce an admin redirect if role is present on the user object
    if (storedUser.role && storedUser.role !== 'admin') {
        router.push('/')
        return
    }

    user.value = storedUser
})

function closeModal() {
    isProfileModalOpen.value = false
    emit('close')
}

const handleLogout = () => {
    localStorage.removeItem('activeUser')
    router.push('/login')
    toast.success("Logged out successfully!")
}

</script>

<template>
    <div class="main-nav relative flex justify-between items-center z-50 bg-primary text-text-sec shadow-2xl p-6">
        <div class="flex items-center">
            <button @click="$emit('toggle-nav')"
                class="dash-nav-trigger lg:hidden bg-transparent text-2xl mb-2 me-2 text-text-sec cursor-pointer">
                &equiv;
            </button>
            <div class="logo m-2">
                <img class="w-36" loading="lazy" src="" alt="logo">
            </div>
        </div>
        <div class="right flex gap-2.5 items-center">
            <router-link to="/" class="m-2 cursor-pointer flex items-center bg-bg rounded-md p-2 text-horizontal-line" title="Visit Website">
                <span class="material-symbols-outlined md:me-2">
                    globe
                </span>
                <span class="hidden md:block">Visit Website</span>
            </router-link>
            <ThemeToggle />
            <div class="avatar flex flex-row-reverse items-center relative">
                <span class="material-symbols-outlined ms-3 cursor-pointer" @click="toggleAccountList">
                    account_circle
                </span>
                <span class="cursor-pointer" @click="toggleAccountList">{{ user.name }}</span>
                <div class="bg-bg p-1 rounded-md absolute top-full right-0 mt-2 shadow-md w-40"
                    v-if="isAccountListOpen">
                    <button @click="toggleProfileModal"
                        class="flex justify-start items-center w-full text-text-main hover:bg-gray/40 p-2 cursor-pointer rounded-md">
                        <span class="material-symbols-outlined me-3">
                            account_circle
                        </span>
                        <span>Profile</span>
                    </button>
                    <button @click="handleLogout"
                        class="flex justify-start items-center w-full text-danger hover:bg-gray/40 p-2 cursor-pointer rounded-md">
                        <span class="material-symbols-outlined me-3">
                            logout
                        </span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
