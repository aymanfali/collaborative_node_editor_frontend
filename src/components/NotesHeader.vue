<template>
  <header
    class="relative z-40 bg-gradient-to-r from-slate-900 to-blue-900 text-white border-b border-white/10 py-3 px-4 sm:px-6 flex items-center justify-between shadow">

    <!-- Left: logo + nav -->
    <div class="flex items-center gap-3">
      <!-- Mobile nav button -->
      <button class="md:hidden p-2 rounded hover:bg-white/10" @click="navOpen = true">☰</button>

      <FontAwesomeIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white/90" :icon="faCopyright" size="2x" />
      <router-link to="/" class="flex flex-col gap-1">
        <h2 class="text-base sm:text-lg font-semibold hidden sm:block">{{ appName }}</h2>
        <p class="text-xs text-white/70 hidden sm:block">Your personal Real-time Note</p>
      </router-link>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-3 md:ml-6">
        <router-link to="/" class="relative px-3 py-1 rounded-full text-sm transition-colors"
          :class="isActive('/') ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-white/80 hover:bg-white/5'">
          Home
        </router-link>
        <router-link to="/notes" class="relative px-3 py-1 rounded-full text-sm transition-colors"
          :class="isActive('/notes') ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-white/80 hover:bg-white/5'">
          Notes
        </router-link>
        <router-link to="/about" class="relative px-3 py-1 rounded-full text-sm transition-colors"
          :class="isActive('/about') ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-white/80 hover:bg-white/5'">
          About
        </router-link>
      </nav>
    </div>

    <!-- Right: user/account -->
    <div class="flex items-center gap-3">
      <ThemeToggle />
      <template v-if="isLoggedIn">
        <button v-if="isAdmin" @click="goDashboard"
          class="flex items-center px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
          <FontAwesomeIcon class="sm:mr-3" :icon="faGaugeHigh" /><span class="hidden sm:block">Dashboard</span>
        </button>

        <div class="flex items-center gap-2 relative">
          <div class="font-medium cursor-pointer hidden sm:block" @click="toggleAccountList">{{ userName }}</div>

          <img v-if="userAvatar" :src="userAvatar" alt="avatar"
            class="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 cursor-pointer" @click="toggleAccountList" />
          <div v-else
            class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white select-none cursor-pointer"
            @click="toggleAccountList">
            {{ userInitial }}
          </div>

          <!-- Account dropdown -->
          <div v-if="isAccountListOpen" ref="accountDropdown"
            class="account-dropdown backdrop-blur bg-white/10 dark:text-white text-slate-800 p-1 rounded-md absolute top-10 right-0 mt-2 shadow-lg w-44 border border-white/10"
            aria-expanded="true">
            <button @click="goProfile"
              class="flex justify-start items-center w-full hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
              <FontAwesomeIcon class="mr-3" :icon="faUser" />
              <span>Profile</span>
            </button>
            <button @click="handleLogout"
              class="flex justify-start items-center w-full text-red-300 hover:bg-slate-800/10 dark:hover:bg-white/10 p-2 cursor-pointer rounded-md">
              <FontAwesomeIcon class="mr-3" :icon="faArrowRightFromBracket" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <button @click="goLogin"
          class="flex items-center px-3 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 text-sm">
          <FontAwesomeIcon class="sm:me-3" :icon="faArrowRightToBracket" /><span class="hidden sm:block">Login</span>
        </button>
        <button @click="goRegister"
          class="px-3 py-2 rounded-md border border-white/30 hover:bg-white/10 text-white text-sm hidden sm:block">
          <FontAwesomeIcon class="sm:me-3" :icon="faUserPlus" />Register
        </button>
      </template>
    </div>

    <!-- Mobile Off-Canvas Menu -->
    <transition name="slide">
      <div v-if="navOpen" class="fixed inset-0 z-50 flex">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/50" @click="navOpen = false"></div>

        <!-- Side panel -->
        <div class="relative bg-slate-900 w-64 max-w-full h-full p-4 text-white">
          <button class="absolute top-4 right-4 text-white text-2xl" @click="navOpen = false">&times;</button>
          <div class="flex m-3">
            <img v-if="userAvatar" :src="userAvatar" alt="avatar"
              class="me-4 w-8 h-8 rounded-full object-cover ring-2 ring-white/10 cursor-pointer" />
            <div class="font-medium cursor-pointer" @click="toggleAccountList">{{ userName }}</div>
          </div>
          <nav class="flex flex-col gap-3 mt-10">
            <router-link to="/" class="px-3 py-2 rounded hover:bg-white/10" @click="navOpen = false">
              <FontAwesomeIcon class="mr-3" :icon="faHome" />Home
            </router-link>
            <router-link to="/notes" class="px-3 py-2 rounded hover:bg-white/10" @click="navOpen = false">
              <FontAwesomeIcon class="mr-3" :icon="faNoteSticky" />Notes
            </router-link>
            <router-link to="/about" class="px-3 py-2 rounded hover:bg-white/10" @click="navOpen = false">
              <FontAwesomeIcon class="mr-3" :icon="faCircleInfo" />About
            </router-link>
            <div v-if="isLoggedIn" class="flex flex-col gap-y-3">
              <router-link v-if="isAdmin" to="/dashboard" class="px-3 py-2 rounded hover:bg-white/10"
                @click="navOpen = false">
                <FontAwesomeIcon class="mr-3" :icon="faGaugeHigh" />Dashboard
              </router-link>
              <router-link to="/profile" class="px-3 py-2 rounded hover:bg-white/10" @click="navOpen = false">
                <FontAwesomeIcon class="mr-3" :icon="faUser" />Profile
              </router-link>
              <button @click="handleLogout" class="px-3 py-2 rounded hover:bg-white/10 text-red-300 w-full text-left">
                <FontAwesomeIcon class="mr-3" :icon="faArrowRightFromBracket" />Logout
              </button>
            </div>
            <div v-else class="flex flex-col gap-2">
              <button @click="goLogin"
                class="flex items-center px-3 py-2 rounded-md bg-white text-slate-900 hover:bg-slate-100 text-sm">
                <FontAwesomeIcon class="me-3" :icon="faArrowRightToBracket" />Login
              </button>
              <button @click="goRegister"
                class="flex px-3 py-2 rounded-md border border-white/30 hover:bg-white/10 text-white text-sm">
                <FontAwesomeIcon class="me-3" :icon="faUserPlus" />Register
              </button>
            </div>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api.js';
import { logout as logoutApi } from '@/services/auth.js';
import { useToast } from 'vue-toastification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket, faArrowRightToBracket, faCopyright, faGaugeHigh, faHome, faNoteSticky, faUser, faUserPlus, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// UI state
const navOpen = ref(false);
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const isAccountListOpen = ref(false);
const userName = ref('');
const userAvatar = ref('');
const userInitial = computed(() => userName.value?.trim()?.charAt(0)?.toUpperCase() || '?');
const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';
const accountDropdown = ref(null);

// Reactive arrow function so template can access it
const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

// Account dropdown click-away
function toggleAccountList() { isAccountListOpen.value = !isAccountListOpen.value; }
function closeAccountList() { isAccountListOpen.value = false; }
const handleClickOutside = (e) => {
  if (accountDropdown.value && !accountDropdown.value.contains(e.target)) closeAccountList();
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

// Fetch user
async function fetchUser() {
  let fetchedUser = null;
  try {
    const res = await api.get('/auth/me'); fetchedUser = res.data?.data || null;
  } catch (_) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        fetchedUser = res.data?.data || null;
      } catch (_) { localStorage.removeItem('activeUser'); }
    }
  }
  if (fetchedUser) {
    localStorage.setItem('activeUser', JSON.stringify(fetchedUser));
    userName.value = fetchedUser.name || '';
    userAvatar.value = fetchedUser.avatar || '';
    isAdmin.value = fetchedUser.role === 'admin';
    isLoggedIn.value = true;
  } else { isLoggedIn.value = false; isAdmin.value = false; userName.value = ''; userAvatar.value = ''; }
}
onMounted(() => {
  try { const cached = JSON.parse(localStorage.getItem('activeUser')); if (cached) { userName.value = cached.name || ''; userAvatar.value = cached.avatar || ''; isAdmin.value = cached.role === 'admin'; isLoggedIn.value = true; } } catch (_) { }
  fetchUser();
});

// Navigation helpers
function goProfile() { closeAccountList(); router.push('/profile'); }
function goLogin() { router.push('/login'); }
function goRegister() { router.push('/register'); }
function goDashboard() { router.push('/dashboard'); }

// Logout
async function handleLogout() {
  try { await logoutApi(localStorage.getItem('refreshToken')); } catch (_) { }
  finally {
    localStorage.removeItem('activeUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    isLoggedIn.value = false;
    isAdmin.value = false;
    toast.success('Logged out successfully');
    router.push('/');
    window.location.reload();
  }
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
