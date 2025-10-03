<script>
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    data() {
        return{
            isDark: false,
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme')

        if (savedTheme == 'dark') {
            this.isDark = true
            document.body.classList.add('dark')
        } else {
            this.isDark = false
        }
    },
    methods: {
        toggleTheme() {
            if (this.isDark) {
                localStorage.setItem('theme', 'dark')
                document.body.classList.add('dark')
            } else {
                localStorage.setItem('theme', 'light')
                document.body.classList.remove('dark')
            }
        },
    }
}
</script>


<template>
    <label class="theme-switch relative inline-block w-5 h-5  cursor-pointer">
        <input v-model="isDark" @change="toggleTheme" type="checkbox" id="theme-toggle" class="opacity-0 w-0 h-0">
        <span class="slider absolute inset-0">
            <FontAwesomeIcon :icon="faSun" />
            <FontAwesomeIcon :icon="faMoon" />
        </span>
    </label>
</template>
