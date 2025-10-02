<script setup>
import { RouterLink } from 'vue-router'
defineProps({
    isOpen: false
})
</script>

<template>
    <nav :class="{ 'hidden': !isOpen, 'block': isOpen }"
        class="lg:block bg-primary shadow-2xl md:shadow-none lg:relative w-3xs absolute flex flex-col justify-between overflow-y-auto">
        <div :class="{ 'hidden': !isOpen, 'block': isOpen }" class="fixed inset-0 bg-black/50"></div>
        <ul>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex px-7 py-4" to="/dashboard"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard', 'text-text-sec': $route.path !== '/dashboard' }">
                    <span class="material-symbols-rounded me-2">
                        home
                    </span>
                    Home
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex px-7 py-4" to="/dashboard/users"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/users', 'text-text-sec': $route.path !== '/dashboard/users' }">
                    <span class="material-symbols-rounded me-2">
                        account_circle
                    </span>
                    Users
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex  px-7 py-4"
                    to="/dashboard/impacts"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/impacts', 'text-text-sec': $route.path !== '/dashboard/impacts' }">
                    <span class="material-symbols-rounded me-2">
                        news
                    </span>
                    Impacts
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex  px-7 py-4"
                    to="/dashboard/news"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/news', 'text-text-sec': $route.path !== '/dashboard/news' }">
                    <span class="material-symbols-rounded me-2">
                        news
                    </span>
                    News
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex  px-7 py-4"
                    to="/dashboard/contacts"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/contacts', 'text-text-sec': $route.path !== '/dashboard/contacts' }">
                    <span class="material-symbols-rounded me-2">
                        mail
                    </span>
                    Contacts
                </RouterLink>
            </li>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex  px-7 py-4"
                    to="/dashboard/about"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/about', 'text-text-sec': $route.path !== '/dashboard/about' }">
                    <span class="material-symbols-rounded me-2">
                        info
                    </span>
                    About
                    Us
                </RouterLink>
            </li>
        </ul>
        <ul>
            <li class="flex items-center relative">
                <RouterLink class="hover:bg-bg hover:text-text-main no-underline w-full flex  px-7 py-4"
                    to="/dashboard/settings"
                    :class="{ 'rounded-l-md bg-bg text-text-main font-bold ms-2': $route.path === '/dashboard/settings', 'text-text-sec': $route.path !== '/dashboard/settings' }">
                    <span class="material-symbols-rounded me-2">
                        settings
                    </span>
                    Settings
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>
