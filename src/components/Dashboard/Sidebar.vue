<script setup>
import { faHouse, faNoteSticky, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RouterLink } from 'vue-router'

defineProps({
    isOpen: { type: Boolean, default: true }
})
</script>

<template>
    <nav :class="{ 'hidden': !isOpen, 'block': isOpen }"
        class="lg:block bg-gradient-to-b from-slate-900 to-blue-950 text-white md:shadow-none lg:relative w-64 absolute flex flex-col justify-between overflow-y-auto">
        <div :class="{ 'hidden': !isOpen, 'block': isOpen }" class="fixed inset-0 bg-black/50"></div>
        <ul class="py-3">
            <li class="flex items-center relative">
                <RouterLink
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors"
                    to="/dashboard"
                    :class="{ 'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard', 'hover:bg-white/5': $route.path !== '/dashboard' }">
                    <FontAwesomeIcon class="me-3" :icon="faHouse" />
                    <span>Home</span>
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors"
                    to="/dashboard/users"
                    :class="{ 'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard/users', 'hover:bg-white/5': $route.path !== '/dashboard/users' }">
                    <FontAwesomeIcon class="me-3" :icon="faUser" />
                    <span>Users</span>
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink
                    class="no-underline w-full flex items-center px-5 py-3 rounded-md transition-colors"
                    to="/dashboard/notes"
                    :class="{ 'bg-white/10 ring-1 ring-white/20 font-semibold': $route.path === '/dashboard/notes', 'hover:bg-white/5': $route.path !== '/dashboard/notes' }">
                    <FontAwesomeIcon class="me-3" :icon="faNoteSticky" />
                    <span>Notes</span>
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>
