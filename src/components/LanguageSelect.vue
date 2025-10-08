<template>
  <div class="relative inline-block text-left" ref="root">
    <button type="button"
      class="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 text-white focus:outline-none border border-white/10"
      :class="sizeClasses" @click.stop="toggle" :aria-expanded="open ? 'true' : 'false'" aria-haspopup="listbox">
      <FontAwesomeIcon :icon="faLanguage" />
      <span class="truncate">{{ currentLabel }}</span>
      <svg class="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clip-rule="evenodd" />
      </svg>
    </button>

    <transition name="fade">
      <div v-if="open"
        class="absolute z-50 mt-2 min-w-40 w-max right-0 rtl:left-0 rtl:right-auto rounded-md backdrop-blur bg-white/10 text-slate-800 dark:text-white border border-white/10 shadow-lg overflow-hidden"
        role="listbox" :aria-activedescendant="`lang-${activeIndex}`">
        <button v-for="(opt, idx) in options" :key="opt.value" type="button"
          class="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-slate-800/10 dark:hover:bg-white/10 focus:bg-slate-800/10 focus:outline-none"
          :class="{ 'bg-white/10': opt.value === locale.value }" role="option" :id="`lang-${idx}`"
          @click="select(opt.value)">
          <span class="flex-1">{{ opt.label }}</span>
          <span v-if="opt.value === locale.value" class="text-emerald-300">•</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale as applyLocale } from '@/i18n'
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  size: { type: String, default: 'sm' } // 'sm' | 'md'
})
const emit = defineEmits(['change'])

const { locale, t } = useI18n()

const root = ref(null)
const open = ref(false)
const activeIndex = ref(0)

const options = computed(() => [
  { value: 'en', label: t('nav.english') },
  { value: 'ar', label: t('nav.arabic') }
])

const currentLabel = computed(() => {
  const found = options.value.find(o => o.value === locale.value)
  return found ? found.label : t('nav.language')
})

const sizeClasses = computed(() => {
  return props.size === 'md'
    ? 'px-3 py-2 text-sm'
    : 'px-2 py-1 text-xs'
})

function toggle() { open.value = !open.value }
function close() { open.value = false }

function onClickAway(e) {
  if (root.value && !root.value.contains(e.target)) close()
}

function onKeydown(e) {
  if (!open.value) return
  if (e.key === 'Escape') { e.preventDefault(); close(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = (activeIndex.value + 1) % options.value.length }
  if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = (activeIndex.value - 1 + options.value.length) % options.value.length }
  if (e.key === 'Enter') { e.preventDefault(); const opt = options.value[activeIndex.value]; if (opt) select(opt.value) }
}

function select(val) {
  applyLocale(val)
  emit('change', val)
  close()
}

onMounted(() => {
  document.addEventListener('click', onClickAway)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickAway)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:global(html[dir='rtl']) .rtl\:left-0 { left: 0; }
:global(html[dir='rtl']) .rtl\:right-auto { right: auto; }
</style>
