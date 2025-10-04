<template>
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <!-- Header -->
        <NotesHeader @toggle-nav="toggleNav" />

        <!-- Mobile nav overlay & panel -->
        <transition name="fade">
            <div v-if="navOpen" class="fixed inset-0 z-50 lg:hidden">
                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/50" @click="toggleNav"></div>

                <!-- Nav panel slides down -->
                <transition name="slide-down">
                    <nav role="dialog" aria-modal="true" class="absolute top-16 left-4 right-4 z-50 bg-white dark:bg-gray-900
                   rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700
                   overflow-hidden">
                        <ul class="flex flex-col gap-2">
                            <li>
                                <router-link to="/" @click="toggleNav">Home</router-link>
                            </li>
                            <li>
                                <router-link to="/notes" @click="toggleNav">Notes</router-link>
                            </li>
                            <li>
                                <router-link to="/profile" @click="toggleNav">Profile</router-link>
                            </li>
                        </ul>
                    </nav>
                </transition>
            </div>
        </transition>

        <!-- Main content -->
        <main class="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
            <slot />
        </main>

        <!-- Footer -->
        <NotesFooter />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import NotesHeader from '@/components/NotesHeader.vue';
import NotesFooter from '@/components/NotesFooter.vue';

const navOpen = ref(false);

const toggleNav = () => {
    console.log('Toggled nav:', !navOpen.value);
    navOpen.value = !navOpen.value;
};
</script>
