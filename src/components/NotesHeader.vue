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

      <nav class="hidden md:flex items-center gap-3 ml-6">
        <router-link to="/" class="relative px-3 py-1 rounded-full text-sm transition-colors"
          :class="isActive('/') ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-white/80 hover:bg-white/5'">
          Home
        </router-link>

        <router-link to="/notes" class="relative px-3 py-1 rounded-full text-sm transition-colors"
          :class="isActive('/notes') ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-white/80 hover:bg-white/5'">
          Notes
        </router-link>
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <ThemeToggle />
      <template v-if="isLoggedIn">
        <button v-if="isAdmin" @click="goDashboard"
          class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
          <FontAwesomeIcon class="me-3" :icon="faGaugeHigh" />Dashboard
        </button>
        <div class="flex items-center gap-2">
          <div class="font-medium cursor-pointer" @click="toggleAccountList">{{ userName }}</div>
        </div>
        <img v-if="userAvatar" :src="userAvatar" alt="avatar"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 cursor-pointer" @click="toggleAccountList" />
        <div v-else
          class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white select-none cursor-pointer"
          @click="toggleAccountList">
          {{ userInitial }}
        </div>

        <div class="relative">
          <div v-if="isAccountListOpen"
            class="backdrop-blur bg-white/10 dark:text-white text-slate-800 p-1 rounded-md absolute top-10 right-0 mt-2 shadow-lg w-44 border border-white/10">
            <button @click="goProfile"
              class="flex justify-start items-center w-full hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
              <FontAwesomeIcon class="me-3" :icon="faUser" />
              <span>Profile</span>
            </button>
            <button @click="handleLogout"
              class="flex justify-start items-center w-full text-red-300 hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
              <FontAwesomeIcon class="me-3" :icon="faArrowRightFromBracket" />
              <span>Logout</span>
            </button>
          </div>
        </div>

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
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api.js';
import { logout as logoutApi } from '@/services/auth.js';
import { useToast } from 'vue-toastification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket, faCopyright, faGaugeHigh, faUser } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from '@/components/ThemeToggle.vue';

const emit = defineEmits(['toggle-nav']);

const userName = ref('');
const userAvatar = ref('');
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const isAccountListOpen = ref(false)
const router = useRouter();
const route = useRoute();

const isActive = (path) => {
  if (!route || !route.path) return false;
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}
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

function toggleAccountList() {
  isAccountListOpen.value = !isAccountListOpen.value
}

function goProfile() {
  isAccountListOpen.value = false
  router.push('/profile')
}

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
