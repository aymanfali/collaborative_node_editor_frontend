<template>
  <section>
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
      {{ $t('dashboard.title') }}
    </h1>
    <p class="text-slate-500 dark:text-slate-300 mb-6">
      {{ $t('dashboard.subtitle') }}
    </p>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      <!-- Users -->
      <div class="relative rounded-xl p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
        <div class="flex">
          <FontAwesomeIcon class="me-3" :icon="faUser" size="4x" />
          <div>
            <div class="text-sm opacity-90 mb-1">{{ $t('dashboard.totalUsers') }}</div>
            <div class="text-3xl font-bold">
              <span v-if="loading">...</span>
              <span v-else>{{ stats.users }}</span>
            </div>
          </div>
        </div>
        <router-link to="/dashboard/users" :class="[
          'px-3 py-2 rounded-md absolute bottom-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm text-center',
          isRTL ? 'left-4' : 'right-4'
        ]">
          {{ $t('dashboard.manageUsers') }}
        </router-link>
      </div>

      <!-- Notes -->
      <div class="relative rounded-xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
        <div class="flex">
          <FontAwesomeIcon class="me-3" :icon="faNoteSticky" size="4x" />
          <div>
            <div class="text-sm opacity-90 mb-1">{{ $t('dashboard.totalNotes') }}</div>
            <div class="text-3xl font-bold">
              <span v-if="loading">...</span>
              <span v-else>{{ stats.notes }}</span>
            </div>
          </div>
        </div>
        <router-link to="/dashboard/notes" :class="[
          'px-3 py-2 rounded-md absolute bottom-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm text-center',
          isRTL ? 'left-4' : 'right-4'
        ]">
          {{ $t('dashboard.manageNotes') }}
        </router-link>
      </div>

      <!-- Active Sessions -->
      <div class="rounded-xl p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
        <div class="flex">
          <FontAwesomeIcon class="me-3" :icon="faHourglassStart" size="4x" />
          <div>
            <div class="text-sm opacity-90 mb-1">{{ $t('dashboard.activeSessions') }}</div>
            <div class="text-3xl font-bold">
              <span v-if="loading">...</span>
              <span v-else>{{ stats.activeSessions }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Recent Activity -->
    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div
        class="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <h2 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-3">
          {{ $t('dashboard.recentActivity') }}
        </h2>

        <div v-if="loadingRecent" class="text-slate-500 dark:text-slate-400">
          {{ $t('dashboard.loadingRecent') }}
        </div>

        <ul v-else class="space-y-3">
          <li v-for="note in recentNotes" :key="note._id" class="flex items-start justify-between">
            <div>
              <router-link :to="{ name: 'note-show', params: { id: note._id } }"
                class="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                {{ note.title || '(untitled)' }}
              </router-link>
              <div class="text-xs text-slate-500">{{ formatDate(note.updatedAt || note.createdAt) }}</div>
            </div>
            <div class="text-xs text-slate-400">{{ note.author?.name || '' }}</div>
          </li>

          <li v-if="recentNotes.length === 0" class="text-sm text-slate-500 italic">
            {{ $t('dashboard.noRecent') }}
          </li>
        </ul>
      </div>
    </div>

    <Alert v-if="error" :message="error" type="error" class="mt-4" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHourglassStart, faNoteSticky, faUser } from '@fortawesome/free-solid-svg-icons'
import Alert from '@/components/Alert.vue'

const { locale } = useI18n()
const isRTL = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const stats = ref({ users: 0, notes: 0, activeSessions: 0 })
const recentNotes = ref([])
const loading = ref(true)
const loadingRecent = ref(true)
const error = ref('')

function formatDate(value) {
  if (!value) return ''
  try { return new Date(value).toLocaleString() } catch { return value }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/stats')
    stats.value = data
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to load stats'
  } finally {
    loading.value = false
  }
})

async function fetchRecentNotes() {
  loadingRecent.value = true
  try {
    const res = await api.get('/notes?limit=5')
    recentNotes.value = res.data || []
  } catch (e) {
    console.warn('Failed to load recent notes', e)
  } finally {
    loadingRecent.value = false
  }
}

onMounted(fetchRecentNotes)
</script>
