<template>
  <footer class="mt-8 py-6 sm:py-8 bg-gradient-to-r from-slate-900 to-blue-900 text-white border-t border-white/5">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
        <!-- Brand / Logo -->
        <div class="flex flex-col items-start gap-2">
          <div class="flex flex-col sm:flex-row items-center mx-auto gap-3">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold">
              <FontAwesomeIcon class="m-3" :icon="faCopyright" size="3x" />
            </div>
            <div class="text-center sm:text-left mx-3">
              <div class="font-semibold">{{ appName }}</div>
              <div class="text-sm text-white/80">Collaborative notes, made simple</div>
            </div>
          </div>

        </div>

        <!-- Pages -->
        <div class="text-center md-text-left">
          <div class="font-medium mb-2">Pages</div>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-md hover:underline" :class="$route.path === '/' ? 'underline' : ''">
                <FontAwesomeIcon class="me-3" :icon="faHome" />Home
              </router-link>
            </li>
            <li>
              <router-link to="/notes" class="text-md hover:underline"
                :class="$route.path.startsWith('/notes') ? 'underline' : ''">
                <FontAwesomeIcon class="me-3" :icon="faNoteSticky" />Notes
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-md hover:underline"
                :class="$route.path.startsWith('/about') ? 'underline' : ''">
                <FontAwesomeIcon class="me-3" :icon="faCircleInfo" />About
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="text-center md-text-left">
          <div class="font-medium mb-2">Contact</div>
          <div class=" text-white/80">
            <div>
              <FontAwesomeIcon class="me-3" :icon="faEnvelope" />
              <a href="mailto:support@conotes.app" class="underline">support@conotes.app</a>
            </div>
            <div class="font-medium mt-2">Follow us:</div>
            <div class="mt-3 flex justify-center items-center text-center gap-3">
              <a href="#" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faXTwitter" />
              </a>
              <a href="https://www.linkedin.com/in/ayman-f-ali/" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faSquareLinkedin" />
              </a>
              <a href="https://github.com/aymanfali" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faGithub" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr class="border my-4 border-slate-200/20">
      <div class="text-md text-center text-white/60 mt-3">© {{ new Date().getFullYear() }} {{ appName }}. All rights
        reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { faGithub, faSquareLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopyright, faEnvelope, faHome, faNoteSticky, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';

</script>
