<script setup>
import { ref, onMounted, watch } from 'vue'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const isDark = ref(false)

function applyDarkClass(add) {
    try {
        const root = document.documentElement
        if (add) {
            root.classList.add('dark')
            document.body.classList.add('dark')
        } else {
            root.classList.remove('dark')
            document.body.classList.remove('dark')
        }
    } catch (_) {
        // ignore server-side or unavailable DOM
    }
}

onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
        isDark.value = true
        applyDarkClass(true)
        return
    }

    if (saved === 'light') {
        isDark.value = false
        applyDarkClass(false)
        return
    }

    // respect system preference if no explicit setting
    try {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            isDark.value = true
            applyDarkClass(true)
        }
    } catch (_) {}
})

watch(isDark, (val) => {
    if (val) {
        localStorage.setItem('theme', 'dark')
        applyDarkClass(true)
    } else {
        localStorage.setItem('theme', 'light')
        applyDarkClass(false)
    }
})
</script>

<template>
    <label dir="ltr" class="theme-switch relative inline-flex items-center cursor-pointer" aria-label="Toggle theme">
        <input
            type="checkbox"
            class="sr-only"
            role="switch"
            :checked="isDark"
            @change="isDark = !isDark"
            aria-checked="isDark"
        />
        <span class="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full relative flex items-center px-1 transition-colors">
            <span class="w-4 h-4 bg-white rounded-full shadow transform transition-transform" :class="{ 'translate-x-4': isDark, 'translate-x-0': !isDark }"></span>
            <span class="absolute left-1 text-xs text-yellow-500" v-if="!isDark">
                <FontAwesomeIcon :icon="faSun" />
            </span>
            <span class="absolute right-0 text-xs text-slate-800" v-if="isDark">
                <FontAwesomeIcon :icon="faMoon" />
            </span>
        </span>
    </label>
</template>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>
