<template>
  <section>
      <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Admin Dashboard</h1>
      <p class="text-slate-500 dark:text-slate-300 mb-6">Overview and quick actions</p>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-xl p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
          <div class="text-sm opacity-90 mb-1">Total Users</div>
          <div class="text-3xl font-bold">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.users }}</span>
          </div>
        </div>
        <div class="rounded-xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
          <div class="text-sm opacity-90 mb-1">Total Notes</div>
          <div class="text-3xl font-bold">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.notes }}</span>
          </div>
        </div>
        <div class="rounded-xl p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
          <div class="text-sm opacity-90 mb-1">Active Sessions</div>
          <div class="text-3xl font-bold">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.activeSessions }}</span>
          </div>
        </div>
        <div class="rounded-xl p-5 bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md">
          <div class="text-sm opacity-90 mb-1">Errors (24h)</div>
          <div class="text-3xl font-bold">—</div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h2 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-3">Recent Activity</h2>
          <div class="text-slate-500 dark:text-slate-400">No recent activity yet.</div>
        </div>
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h2 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-3">Quick Actions</h2>
          <div class="flex flex-col gap-2">
            <router-link to="/dashboard/users" class="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm text-center">Manage Users</router-link>
            <router-link to="/dashboard/notes" class="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm text-center">Manage Notes</router-link>
          </div>
        </div>
      </div>
      <p v-if="error" class="mt-4 text-sm text-rose-600">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({ users: 0, notes: 0, activeSessions: 0 })
const loading = ref(true)
const error = ref('')

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
</script>
