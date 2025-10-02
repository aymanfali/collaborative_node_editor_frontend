<script>
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
            <img class="icon sun-icon absolute w-4 h-4 top-1/2 -translate-y-1/2 z-10 left-0 opacity-100 dark:opacity-0"
                style="filter: brightness(0) saturate(100%) invert(100%) sepia(97%) saturate(13%) hue-rotate(237deg) brightness(104%) contrast(104%);"
                src="../../public/icons/sun-solid.svg" alt="light_mode">
            <img class="icon moon-icon absolute w-4 h-4 top-1/2 -translate-y-1/2 z-10 left-0 opacity-0 dark:opacity-100"
                style="filter: brightness(0) saturate(100%) invert(100%) sepia(97%) saturate(13%) hue-rotate(237deg) brightness(104%) contrast(104%);"
                src="../../public/icons/moon-solid.svg" alt="dark_mode">
        </span>
    </label>
</template>
