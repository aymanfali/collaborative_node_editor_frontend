<template>
  <header
    class="relative z-40 bg-gradient-to-r from-slate-900 to-blue-900 text-white border-b border-white/10 py-4 px-6 flex items-center justify-between shadow">
    <div class="flex items-center gap-3">
      <button class="md:hidden p-2 rounded hover:bg-white/10" @click="$emit('toggle-nav')">☰</button>
      <FontAwesomeIcon class="me-3" :icon="faCopyright" size="3x" />
      <div>
        <h2 class="text-lg font-semibold">{{ appName }}</h2>
        <p class="text-sm text-white/70 hidden sm:block">Your personal Real-time Note</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <template v-if="isLoggedIn">
        <div class="flex items-center gap-2">
          <div class="text-sm text-white/80">Welcome back,</div>
          <div class="font-medium">{{ userName }}</div>
        </div>
        <img v-if="userAvatar" :src="userAvatar" alt="avatar"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
        <div v-else
          class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white select-none">
          {{ userInitial }}
        </div>
        <button v-if="isAdmin" @click="goDashboard"
          class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
          <FontAwesomeIcon class="me-3" :icon="faGaugeHigh" />Dashboard
        </button>
        <button @click="handleLogout" class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
          <FontAwesomeIcon class="me-3" :icon="faArrowRightFromBracket" />Logout
        </button>
      </template>
      <template v-else>
        <button @click="goLogin"
          class="px-3 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 text-sm">Login</button>
        <button @click="goRegister"
          class="px-3 py-2 rounded-md border border-white/30 hover:bg-white/10 text-white text-sm">Register</button>
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
import { faArrowRightFromBracket, faCopyright, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits(['toggle-nav']);

const userName = ref('');
const userAvatar = ref('');
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const router = useRouter();
// Read application name from Vite env. Vite only exposes variables prefixed with VITE_.
const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';
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

