<template>
    <footer
        class="relative flex justify-between items-center z-50 bg-gradient-to-l from-slate-900 to-blue-900 text-white border-b border-white/10 p-5 shadow-md">
        <div class="text-center text-white w-full">
            {{ $t('dashboard.footerBrand') }} &copy; {{ new Date().getFullYear() }}
        </div>
    </footer>
</template>
