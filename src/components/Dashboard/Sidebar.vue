<script setup>
import { faHouse, faNoteSticky, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RouterLink } from 'vue-router'

defineProps({
    isOpen: { type: Boolean, default: true }
})
</script>

<template>
    <!-- Overlay (mobile only) -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 lg:hidden z-20" @click="$emit('close')"></div>

    <!-- Sidebar -->
    <nav :class="[
        isOpen ? 'block' : 'hidden',
        // Base (mobile)
        'fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-slate-900 to-blue-950 text-white flex flex-col justify-between overflow-y-auto z-30',
        // Desktop (inline)
        'lg:static lg:block lg:h-auto lg:w-64  lg:shadow-sm lg:overflow-visible'
    ]">
        <ul class="py-3">
            <li>
                <RouterLink to="/dashboard"
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors" :class="{
                        'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard',
                        'hover:bg-white/5': $route.path !== '/dashboard'
                    }">
                    <FontAwesomeIcon class="me-3" :icon="faHouse" />
                    <span>{{ $t('sidebar.home') }}</span>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/dashboard/users"
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors" :class="{
                        'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard/users',
                        'hover:bg-white/5': $route.path !== '/dashboard/users'
                    }">
                    <FontAwesomeIcon class="me-3" :icon="faUser" />
                    <span>{{ $t('sidebar.users') }}</span>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/dashboard/notes"
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors" :class="{
                        'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard/notes',
                        'hover:bg-white/5': $route.path !== '/dashboard/notes'
                    }">
                    <FontAwesomeIcon class="me-3" :icon="faNoteSticky" />
                    <span>{{ $t('sidebar.notes') }}</span>
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>
