<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50" @click.self="onCancel"></div>

            <div class="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <header class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ title }}</h3>
                </header>

                <section class="px-6 py-4">
                    <p class="text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
                    <slot name="body" />
                </section>

                <footer class="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                    <button @click="onCancel"
                        class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
                        {{ cancelText }}
                    </button>

                    <button @click="onConfirm"
                        :class="['inline-flex items-center px-4 py-2 rounded-md text-sm font-medium', destructive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-indigo-600 text-white hover:bg-indigo-700']">
                        {{ confirmText }}
                    </button>
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  destructive: { type: Boolean, default: false }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

function close() {
  emit('update:show', false)
}

function onCancel() {
  emit('cancel')
  close()
}

function onConfirm() {
  emit('confirm')
  close()
}

function onKey(e) {
  if (e.key === 'Escape' && props.show) {
    onCancel()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// keep body locked when modal open
watch(() => props.show, (v) => {
  if (v) document.documentElement.style.overflow = 'hidden'
  else document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* minimal styling is provided via Tailwind classes in template */
</style>
