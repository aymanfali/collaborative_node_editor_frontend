<template>
  <div class="min-h-screen bg-gradient-to-b dark:bg-slate-900">
    <NotesHeader />

    <main class="max-w-[1440px] mx-auto px-8 py-16 space-y-16">
      <!-- Hero -->
      <section class="flex justify-center gap-8 items-center">
        <div class="my-2 max-w-4xl">
          <h1 class="text-4xl text-center md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            About CoNotes
          </h1>
          <p class="my-10 text-lg text-center text-slate-600 dark:text-slate-300">
            CoNotes is a collaborative notes app for teams and individuals. Create, edit, and
            collaborate in real-time with secure access controls and a modern, fast UI.
          </p>

          <div class="mt-8 max-w-fit mx-auto grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="sm:flex items-start gap-3">
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
                <div class="font-medium">Easy sharing</div>
                <div class="text-xs">Invite teammates in seconds.</div>
              </div>
            </div>
            <div class="sm:flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FontAwesomeIcon :icon="faLock" />
              </div>
              <div>
                <div class="font-medium">Secure by default</div>
                <div class="text-xs">Auth, roles, and privacy.</div>
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
      </section>

      <hr class="border-slate-400/20" />

      <!-- Key features (cards) -->
      <section>
        <h2 class="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-2">Key features</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">A modern toolkit for collaborative
          note-taking.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
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
                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Fast editor</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Rich text and markdown-friendly note
                  editing with instant feedback.</p>
              </div>
            </div>
          </article>

          <!-- Feature 2 -->
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
                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Collaboration</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Share notes, co-edit seamlessly, and keep
                  everyone in sync.</p>
              </div>
            </div>
          </article>

          <!-- Feature 3 -->
          <article
            class="group bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-800 dark:to-amber-700 text-amber-600 dark:text-white flex items-center justify-center text-xl">
                  <FontAwesomeIcon :icon="faLock" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold mt-1 dark:text-slate-200">Privacy & roles</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Authentication, role-based access, and
                  secure storage.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <hr class="border-slate-400/20" />

      <!-- Under the hood -->
      <section>
        <h2 class="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-5">Why CoNotes?</h2>
        <!-- Visual card -->
        <div class="hidden lg:block">
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow">
              <li class="flex items-center gap-3">
                <FontAwesomeIcon :icon="faCircleCheck" size="2x" />
                Reduce friction in capturing, organizing, and sharing knowledge.
              </li>
            </div>
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow">
              <li class="flex items-center gap-3">
                <FontAwesomeIcon :icon="faCircleCheck" size="2x" />
                Built with performance and simplicity in mind.
              </li>
            </div>
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow">
              <li class="flex items-center gap-3">
                <FontAwesomeIcon :icon="faCircleCheck" size="2x" />
                Designed for teams, friendly for individuals.
              </li>
            </div>
          </ul>
        </div>
      </section>

      <hr class="border-slate-400/20" />

      <!-- CTA -->
      <section class="rounded-xl p-6 bg-indigo-600 text-white">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex gap-5 items-center">
            <FontAwesomeIcon class="me-3" :icon="faBolt" size="2x" />
            <div>
              <h3 class="text-xl font-semibold">Ready to try CoNotes?</h3>
              <p class="text-sm opacity-90">Get started for free — no credit card required.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <router-link to="/register" class="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium">Get
              started</router-link>
          </div>
        </div>
      </section>
    </main>

    <hr class="border-slate-400/20" />

    <NotesFooter />
  </div>
</template>

<script setup>
import NotesHeader from '@/components/NotesHeader.vue'
import NotesFooter from '@/components/NotesFooter.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate, faShare, faLock, faHand, faBolt, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
</script>

<style scoped></style>
