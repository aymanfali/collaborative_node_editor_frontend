<template>
  <footer class="mt-8 py-4 text-center text-sm text-gray-500">
    <div class="max-w-5xl mx-auto">© {{ new Date().getFullYear() }} {{ appName }}</div>
  </footer>
</template>

<script setup>
const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';

</script>
