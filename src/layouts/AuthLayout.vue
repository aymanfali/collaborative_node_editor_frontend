<script setup>
import Footer from '@/components/Dashboard/Footer.vue';
import Header from '@/components/Dashboard/Header.vue';
import Sidebar from '@/components/Dashboard/Sidebar.vue';
import { ref } from 'vue';

const navOpen = ref(false);

const toggleNav = () => {
    navOpen.value = !navOpen.value;
};
</script>

<template>
    <Header @toggle-nav="toggleNav" />
    <div class="flex min-h-[80vh] bg-slate-50 dark:bg-slate-950">
        <Sidebar :is-open="navOpen" />
        <main class="m-5 p-6 w-full text-text-main bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <router-view />
        </main>
    </div>
    <Footer />
</template>
