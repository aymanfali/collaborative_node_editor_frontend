<template>
    <div class="min-h-screen flex bg-gray-50">
        <div class="flex-1">
            <NotesHeader @toggle-nav="toggleNav" />
            <main class="p-6 max-w-5xl mx-auto">
                <slot />
            </main>
            <NotesFooter />
        </div>
    </div>
</template>

<script setup>
import NotesHeader from '@/components/NotesHeader.vue';
import NotesFooter from '@/components/NotesFooter.vue';
</script>
