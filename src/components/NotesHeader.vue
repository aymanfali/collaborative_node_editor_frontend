<template>
    <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button class="md:hidden p-2 rounded hover:bg-gray-100" @click="$emit('toggle-nav')">☰</button>
            <img src="/favicon.ico" alt="logo" class="w-10 h-10 rounded" />
            <div>
                <h2 class="text-lg font-semibold">Notes</h2>
                <p class="text-sm text-gray-500 hidden sm:block">Your personal workspace</p>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <template v-if="isLoggedIn">
                <div class="flex items-center gap-2">
                    <div class="text-sm text-gray-600">Welcome back,</div>
                    <div class="font-medium">{{ userName }}</div>
                </div>
                <img v-if="userAvatar" :src="userAvatar" alt="avatar" class="w-8 h-8 rounded-full object-cover" />
                <div v-else
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 select-none">
                    {{ userInitial }}
                </div>
                <button v-if="isAdmin" @click="goDashboard"
                    class="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                    <FontAwesomeIcon class="me-3" :icon="faGaugeHigh" />Dashboard
                </button>
                <button @click="handleLogout"
                    class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">Logout</button>
            </template>
            <template v-else>
                <button @click="goLogin"
                    class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Login</button>
                <button @click="goRegister"
                    class="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 text-sm">Register</button>
            </template>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api.js';
import { logout as logoutApi } from '@/services/auth.js';
import { useToast } from 'vue-toastification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGaugeHigh } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits(['toggle-nav']);

const userName = ref('');
const userAvatar = ref('');
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const router = useRouter();
const userInitial = computed(() => (userName.value?.trim()?.charAt(0)?.toUpperCase() || '?'));
const toast = useToast();

onMounted(async () => {
  // Fast path: hydrate from cached user to render header immediately
  try {
    const cached = JSON.parse(localStorage.getItem('activeUser'));
    if (cached) {
      userName.value = cached.name || '';
      userAvatar.value = cached.avatar || '';
      isAdmin.value = cached.role === 'admin';
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
      userName.value = '';
      userAvatar.value = '';
      isAdmin.value = false;
    }
  } catch (_) {
    isLoggedIn.value = false;
    userName.value = '';
    userAvatar.value = '';
    isAdmin.value = false;
  }

  // Do NOT trust cached user blindly; always validate with backend
  try {
    // 1) Try cookie-based auth (HttpOnly cookies)
    const res = await api.get('/auth/me');
    const fetchedUser = res.data?.data || null;
    if (fetchedUser) {
      localStorage.setItem('activeUser', JSON.stringify(fetchedUser));
      userName.value = fetchedUser.name || '';
      userAvatar.value = fetchedUser.avatar || '';
      isAdmin.value = fetchedUser.role === 'admin';
      isLoggedIn.value = true;
      return;
    }
  } catch (_) {
    // proceed to token fallback
  }

  // 2) Fallback: use bearer token from localStorage if present
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const fetchedUser = res.data?.data || null;
      if (fetchedUser) {
        localStorage.setItem('activeUser', JSON.stringify(fetchedUser));
        userName.value = fetchedUser.name || '';
        userAvatar.value = fetchedUser.avatar || '';
        isAdmin.value = fetchedUser.role === 'admin';
        isLoggedIn.value = true;
      }
    } catch (_) {
      localStorage.removeItem('activeUser');
    }
  }
});

async function handleLogout() {
  try {
    // call backend to clear cookies if any
    const rt = localStorage.getItem('refreshToken');
    await logoutApi(rt);
  } catch (_) {
    // ignore errors; still clear local state
  } finally {
    localStorage.removeItem('activeUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    isLoggedIn.value = false;
    isAdmin.value = false;
    toast.success('Logged out successfully');
    // Hard reload to clear any in-memory state
    router.push('/');
    window.location.reload();
  }
}
function goLogin() {
  router.push('/login');
}

function goRegister() {
  router.push('/register');
}

function goDashboard() {
  router.push('/dashboard');
}
</script>

