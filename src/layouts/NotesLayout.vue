<template>
    <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950">
        <div class="flex-1">
            <NotesHeader @toggle-nav="toggleNav" />
            <main class="p-5 md:p-6 max-w-7xl mx-auto">
                <slot />
            </main>
            <NotesFooter />
        </div>
    </div>
</template>

<script setup>
import NotesHeader from '@/components/NotesHeader.vue';
import NotesFooter from '@/components/NotesFooter.vue';

// Optional placeholder for future side nav toggle
const toggleNav = () => {};
</script>
