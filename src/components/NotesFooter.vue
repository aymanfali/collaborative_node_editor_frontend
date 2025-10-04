<template>
  <footer class="mt-8 py-8 bg-gradient-to-r from-slate-900 to-blue-900 text-white border-t border-white/5">
    <div class="max-w-[1440px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <!-- Brand / Logo -->
        <div class="flex flex-col items-start gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl font-bold">
              <FontAwesomeIcon class="me-3" :icon="faCopyright" size="3x" />
            </div>
            <div>
              <div class="font-semibold">{{ appName }}</div>
              <div class="text-xs text-white/80">Collaborative notes, made simple</div>
            </div>
          </div>
          <div class="text-xs text-white/60 mt-3">© {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
          </div>
        </div>

        <!-- Pages -->
        <div>
          <div class="font-medium mb-2">Pages</div>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-sm hover:underline"
                :class="$route.path === '/' ? 'underline' : ''">Home</router-link>
            </li>
            <li>
              <router-link to="/notes" class="text-sm hover:underline"
                :class="$route.path.startsWith('/notes') ? 'underline' : ''">Notes</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <div class="font-medium mb-2">Contact</div>
          <div class=" text-white/80">
            <div>
              <FontAwesomeIcon class="me-3" :icon="faEnvelope" />
              <a href="mailto:support@conotes.app" class="underline">support@conotes.app</a>
            </div>
            <div class="mt-2">Follow us:</div>
            <div class="mt-1 flex items-center gap-3">
              <a href="#" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faXTwitter" />
              </a>
              <a href="#" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faSquareLinkedin" />
              </a>
              <a href="#" class="text-white/80 hover:text-white">
                <FontAwesomeIcon :icon="faGithub" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { faGithub, faSquareLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopyright, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const appName = import.meta.env.VITE_APP_NAME ?? 'CoNotes';

</script>
