<template>
    <div class="min-h-screen bg-gradient-to-b  dark:bg-slate-900">
        <NotesHeader />

        <main class="max-w-[1440px] mx-auto px-6 py-16 space-y-16">
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div class="my-2">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        Collaborative notes for teams and individuals</h1>
                    <p class="mt-4 text-lg text-slate-600 dark:text-slate-300">Create, edit and collaborate in
                        real-time. Share notes with teammates, track updates, and keep everything in sync across
                        devices.</p>

                    <div class="my-10 flex gap-3">
                        <router-link to="/register"
                            class="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700">
                            <FontAwesomeIcon class="me-3" :icon="faBolt" />Get
                            started
                        </router-link>
                    </div>

                    <div class="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <div class="bsm:flex items-start gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <FontAwesomeIcon :icon="faArrowsRotate" />
                            </div>
                            <div>
                                <div class="font-medium">Real-time sync</div>
                                <div class="text-xs">Everyone sees edits instantly.</div>
                            </div>
                        </div>
                        <div class="sm:flex items-start gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <FontAwesomeIcon :icon="faShare" />
                            </div>
                            <div>
                                <div class="font-medium">Shareable Notes</div>
                                <div class="text-xs">Invite teammates in seconds.</div>
                            </div>
                        </div>
                        <div class="sm:flex items-start gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <FontAwesomeIcon :icon="faLock" />
                            </div>
                            <div>
                                <div class="font-medium">Private by default</div>
                                <div class="text-xs">Secure storage and auth.</div>
                            </div>
                        </div>
                        <div class="sm:flex items-start gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                <FontAwesomeIcon :icon="faHand" />
                            </div>
                            <div>
                                <div class="font-medium">Access controls</div>
                                <div class="text-xs">Manage permissions easily.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hidden lg:block">
                    <div
                        class="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow">
                        <h3 class="text-lg font-semibold mb-3 dark:text-slate-300">Live preview</h3>
                        <div
                            class="h-64 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 rounded p-4 overflow-auto text-sm text-slate-600 dark:text-slate-300">
                            <p class="font-semibold">Meeting notes</p>
                            <p class="mt-2">- Welcome everyone</p>
                            <p>- Discuss roadmap</p>
                            <p>- Assign action items</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr class="border-slate-400/20">

            <!-- How it works (modern cards) -->
            <section>
                <h2 class="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-2">How it works</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Three simple steps to get your
                    team collaborating quickly. Each step includes an interactive preview so you know what to expect.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Step 1 -->
                    <article
                        class="group bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-800 dark:to-indigo-700 text-indigo-600 dark:text-white flex items-center justify-center text-xl">
                                    <FontAwesomeIcon :icon="faBolt" />
                                </div>
                            </div>
                            <div>
                                <div class="text-xs text-indigo-600 font-semibold">Step 1</div>
                                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Create a note</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Open the editor and start
                                    writing — markdown support, attachments, and rich formatting included.</p>
                            </div>
                        </div>
                    </article>

                    <!-- Step 2 -->
                    <article
                        class="group bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-800 dark:to-emerald-700 text-emerald-600 dark:text-white flex items-center justify-center text-xl">
                                    <FontAwesomeIcon :icon="faShare" />
                                </div>
                            </div>
                            <div>
                                <div class="text-xs text-emerald-600 font-semibold">Step 2</div>
                                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Invite collaborators</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Share a link or invite
                                    teammates by email. Manage permissions per-note so everyone has the right access.
                                </p>
                            </div>
                        </div>
                    </article>

                    <!-- Step 3 -->
                    <article
                        class="group bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-800 dark:to-amber-700 text-amber-600 dark:text-white flex items-center justify-center text-xl">
                                    <FontAwesomeIcon :icon="faArrowsRotate" />
                                </div>
                            </div>
                            <div>
                                <div class="text-xs text-amber-600 font-semibold">Step 3</div>
                                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Stay in sync</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Edits are propagated in
                                    real-time so collaborators always see the latest version without conflicts.</p>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <hr class="border-slate-400/20">

            <!-- Testimonials & Live stats -->
            <section>
                <div class="lg:col-span-2 space-y-4">
                    <h2 class="text-2xl font-semibold text-slate-800 dark:text-white text-center">What customers say
                    </h2>

                    <div class="flex items-center justify-center">
                        <Swiper ref="testimonialsSwiper" class="mt-3 w-full" :modules="[Autoplay, Pagination]"
                            :autoplay="{ delay: 4000 }" :loop="true" :pagination="paginationOptions">
                            <SwiperSlide v-for="t in testimonials" :key="t.id">
                                <div class="px-4">
                                    <div
                                        class="p-10 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/30 dark:border-gray-700/30 shadow-xl max-w-3xl mx-auto testimonial-card">
                                        <div class="flex items-center gap-4">
                                            <div
                                                class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-white font-semibold">
                                                <!-- initials -->
                                                {{(t.name || '').split(' ').map(n => n[0]).join('')}}
                                            </div>
                                            <div>
                                                <div class="font-semibold text-base text-slate-900 dark:text-white">{{
                                                    t.name }}</div>
                                                <div class="text-xs text-slate-500 dark:text-slate-400">{{ t.title }}
                                                </div>
                                            </div>
                                        </div>

                                        <blockquote class="m-4 relative pl-6 text-slate-700 dark:text-slate-300">
                                            <span
                                                class="absolute left-0 -top-2 text-5xl text-indigo-100 dark:text-indigo-800">“</span>
                                            <p class="italic text-lg sm:text-xl leading-relaxed">{{ t.quote }}</p>
                                        </blockquote>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </section>

            <hr class="border-slate-400/20">

            <!-- CTA Banner -->
            <section class="rounded-xl p-6 bg-indigo-600 text-white">
                <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex gap-5 items-center">
                        <FontAwesomeIcon class="me-3" :icon="faBolt" size="2x" />
                        <div>
                            <h3 class="text-xl font-semibold">Ready to collaborate?</h3>
                            <p class="text-sm opacity-90">Get started for free — no credit card required.</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <router-link to="/register"
                            class="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium">Get
                            started</router-link>
                    </div>
                </div>
            </section>
        </main>

        <hr class="border-slate-400/20">

        <NotesFooter />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NotesHeader from '@/components/NotesHeader.vue'
import NotesFooter from '@/components/NotesFooter.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate, faBolt, faHand, faLock, faShare } from '@fortawesome/free-solid-svg-icons'
// Swiper (Vue 3)
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = ref([
    { id: 1, name: 'Alex Johnson', title: 'Product Manager', quote: 'This app made our team much more productive.' },
    { id: 2, name: 'Maria Gomez', title: 'Designer', quote: 'Beautiful editor and great collaboration features.' },
    { id: 3, name: 'Chen Wei', title: 'Developer', quote: 'Fast, reliable, and easy to integrate into our workflow.' }
])

// reference to swiper instance (if needed later)
const testimonialsSwiper = ref(null)

// Pagination configuration: renderBullet will inject accessible buttons with title/aria-label
const paginationOptions = {
    clickable: true,
    // renderBullet runs in browser; use closure to include testimonial details for title/aria
    renderBullet: (index, className) => {
        const t = testimonials.value && testimonials.value[index]
        const label = t ? `${t.name} — ${t.title}` : `Testimonial ${index + 1}`
        // return a button element so it's keyboard-focusable and screen-reader friendly
        return `<button class="${className} testimonial-bullet" aria-label="${label}" title="${label}"></button>`
    }
}

onMounted(() => {
    // fetchStats may be implemented later; avoid throwing if missing
    if (typeof fetchStats === 'function') fetchStats()
})
</script>

<style scoped>
/* Testimonial card polish */
.testimonial-card {
    transition: transform 220ms ease, box-shadow 220ms ease;
}

.testimonial-card:hover {
    transform: translateY(-6px);
}

/* Swiper bullets customization */
:deep(.swiper-pagination) {
    display: flex !important;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.75rem;
}

:deep(.testimonial-bullet) {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background-color: rgba(148, 163, 184, 0.35);
    /* slate-400/35 */
    border: 1px solid rgba(148, 163, 184, 0.5);
    transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

:deep(.testimonial-bullet:hover),
:deep(.testimonial-bullet:focus) {
    transform: scale(1.25);
    background-color: rgba(99, 102, 241, 0.9);
    /* indigo-500 */
    outline: none;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.12);
}

:deep(.swiper-pagination-bullet-active) {
    background-color: rgba(99, 102, 241, 1) !important;
    transform: scale(1.3);
}
</style>
