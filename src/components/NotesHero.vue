<template>
  <div class="mb-5">
    <div class="rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 text-slate-900 dark:from-slate-900 dark:to-blue-900 dark:text-white p-5 shadow border border-slate-200 dark:border-white/10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">{{ title }}</h1>
          <p v-if="subtitle" class="text-slate-600 dark:text-white/70 text-sm">{{ subtitle }}</p>
        </div>
        <div class="flex gap-2 flex-wrap justify-end">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.extra" class="mt-3">
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
});
</script>

<style scoped>
</style>
