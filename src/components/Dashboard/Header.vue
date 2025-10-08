<script setup>
import { useRouter } from 'vue-router';
import ThemeToggle from '../ThemeToggle.vue';
import LanguageSelect from '@/components/LanguageSelect.vue';
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import api from '@/services/api.js';
import { useToast } from 'vue-toastification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket, faCopyright, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const user = ref({})
const isAccountListOpen = ref(false)
const avatarContainer = ref(null)
const isProfileModalOpen = ref(false)
const toast = useToast()
const { t } = useI18n()

const emit = defineEmits(['toggle-nav', 'close'])

const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';

function toggleAccountList() {
    isAccountListOpen.value = !isAccountListOpen.value
}

function toggleProfileModal() {
    isProfileModalOpen.value = !isProfileModalOpen.value
}

function goProfile() {
    isAccountListOpen.value = false
    router.push('/profile')
}

onMounted(async () => {
    // Click-away to close account list
    const handleClickAway = (e) => {
        if (isAccountListOpen.value && avatarContainer.value && !avatarContainer.value.contains(e.target)) {
            isAccountListOpen.value = false
        }
    }
    document.addEventListener('click', handleClickAway)

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
    // Cleanup listener when component unmounts
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickAway)
    })
})

const userInitial = computed(() => (user.value?.name?.trim()?.charAt(0)?.toUpperCase() || '?'))

function closeModal() {
    isProfileModalOpen.value = false
    emit('close')
}

const handleLogout = async () => {
    try {
        await api.post('/auth/logout')
    } catch (_) {
        // ignore errors; proceed with client-side cleanup
    }
    localStorage.removeItem('activeUser')
    router.push('/login')
    toast.success(t('toast.loggedOut'))
}

</script>

<template>
    <div
        class=" flex sticky top-0 sm:flex-row justify-between sm:items-center z-50 bg-gradient-to-r from-slate-900 to-blue-900 text-white border-b border-white/10 py-2 px-4 sm:px-6 shadow-md">
        <div class="flex items-center">
            <button @click="$emit('toggle-nav')"
                class="dash-nav-trigger lg:hidden bg-transparent text-2xl mb-0 me-2 cursor-pointer hover:opacity-80"
                aria-label="Toggle navigation" title="Toggle navigation">
                &equiv;
            </button>
            <router-link to="/" class="logo m-2">
                <FontAwesomeIcon class="" :icon="faCopyright" size="3x" />
            </router-link>
            <div>
                <h2 class="text-lg font-semibold hidden sm:block">{{ appName }}</h2>
            </div>
        </div>
        <div class="right flex items-center gap-2.5 mt-3 sm:mt-0">
            <LanguageSelect size="sm" />
            <ThemeToggle />
            <router-link to="/"
                class="m-2 cursor-pointer flex items-center rounded-md px-3 py-2 bg-white/10 hover:bg-white/20 text-white"
                :title="t('common.visitWebsite')">
                <FontAwesomeIcon class="md:me-3" :icon="faGlobe" />
                <span class="hidden md:block">{{ t('common.visitWebsite') }}</span>
            </router-link>
            <div class="avatar flex items-center gap-2 relative" ref="avatarContainer">
                <div v-if="user.avatar" class="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                    @click.stop="toggleAccountList">
                    <img :src="user.avatar" alt="avatar" class="w-full h-full object-cover" />
                </div>
                <div v-else
                    class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white cursor-pointer"
                    @click.stop="toggleAccountList">
                    {{ userInitial }}
                </div>
                <span class="cursor-pointer hidden sm:inline-block" @click.stop="toggleAccountList">{{ user.name }}</span>
                <div class="account-menu backdrop-blur bg-white/10 dark:text-white text-slate-800 p-1 rounded-md absolute top-full mt-2 shadow-lg w-44 border border-white/10 max-w-[90vw]"
                    v-if="isAccountListOpen">
                    <button @click="goProfile"
                        class="flex justify-start items-center w-full hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
                        <FontAwesomeIcon class="me-3" :icon="faUser" />
                        <span>{{ t('profile.title') }}</span>
                    </button>
                    <button @click="handleLogout"
                        class="flex justify-start items-center w-full text-red-300 hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
                        <FontAwesomeIcon class="me-3" :icon="faArrowRightFromBracket" />
                        <span>{{ t('nav.logout') }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Anchor to inline end so it follows LTR/RTL automatically */
.account-menu {
  inset-inline-end: 0;
  inset-inline-start: auto;
}
</style>
