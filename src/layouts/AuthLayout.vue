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
    <div class="flex min-h-[80vh]">
        <Sidebar :is-open="navOpen" />
        <main class="m-5 p-5 border-gray border-[1px] rounded-sm w-full text-text-main">
            <slot />
        </main>
    </div>
    <Footer />
</template>
