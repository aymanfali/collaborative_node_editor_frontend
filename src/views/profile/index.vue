<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import api from '@/services/api.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import NotesLayout from '@/layouts/NotesLayout.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFloppyDisk, faUpload } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const user = ref(null)
const fileInput = ref(null)

const form = reactive({
  name: '',
  email: '',
  avatar: '',
  password: '', // optional (local provider only)
})

const avatarPreview = computed(() => form.avatar?.trim() || '/favicon.ico')

async function fetchMe() {
  loading.value = true
  try {
    const res = await api.get('/auth/me')
    const data = res.data?.data || null
    if (!data) throw new Error('Failed to load profile')
    user.value = data
    form.name = data.name || ''
    form.email = data.email || ''
    form.avatar = data.avatar || ''
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Failed to load profile')
    router.push('/login')
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const payload = { avatar: form.avatar, name: form.name }
    if (form.password && form.password.length >= 6) payload.password = form.password
    const res = await api.patch('/auth/me', payload)
    const updated = res.data?.data || null
    if (updated) {
      localStorage.setItem('activeUser', JSON.stringify(updated))
      toast.success(res.data?.message || 'Profile updated')
      form.password = ''
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

onMounted(fetchMe)

function chooseFile() {
  fileInput.value?.click()
}

async function onFileChange(e) {
  const file = e.target?.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('avatar', file)
    const res = await api.post('/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const updated = res.data?.data
    if (updated?.avatar) {
      form.avatar = updated.avatar
      localStorage.setItem('activeUser', JSON.stringify(updated))
      toast.success(res.data?.message || 'Avatar uploaded')
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Failed to upload avatar')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <NotesLayout>
    <div class="max-w-7xl mx-auto p-4 md:p-6">
      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">Profile</h1>
        <p class="text-slate-500 dark:text-slate-400">Update your profile</p>
      </div>

      <div v-if="loading" class="text-slate-500 dark:text-slate-400">Loading...</div>

      <div v-else
        class="bg-white dark:bg-slate-900/50 backdrop-blur rounded-xl border border-slate-200/70 dark:border-white/10 shadow-sm">
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img :src="avatarPreview" alt="Avatar preview"
              class="w-28 h-28 rounded-full object-cover ring-2 ring-blue-500/30 shadow-md" />
            <div class="flex-1 w-full">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Avatar URL</label>
              <input v-model="form.avatar" type="url" placeholder="https://..."
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Paste a direct image URL. Changes are previewed
                instantly.</p>
              <div class="mt-3 flex items-center gap-2">
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
                <button type="button" @click="chooseFile" :disabled="uploading"
                  class="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white disabled:opacity-60">
                  <FontAwesomeIcon class="me-3" :icon="faUpload" />{{ uploading ? 'Uploading...' : 'Upload from device'
                  }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Name</label>
              <input v-model="form.name" type="text" minlength="3"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
              <input v-model="form.email" type="email" disabled
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300" />
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">New Password
                (optional)</label>
              <input v-model="form.password" type="password" minlength="6"
                placeholder="Enter new password (local accounts only)"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Leave blank to keep current password.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="block text-xs text-slate-500 dark:text-slate-400">Role</span>
                <span class="block text-sm text-slate-800 dark:text-slate-200">{{ user?.role || '-' }}</span>
              </div>
              <div>
                <span class="block text-xs text-slate-500 dark:text-slate-400">Provider</span>
                <span class="block text-sm text-slate-800 dark:text-slate-200">{{ user?.provider || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-3">
            <button @click="save" :disabled="saving"
              class="inline-flex items-center px-4 py-2 rounded-md bg-slate-800/10 hover:bg-slate-800/20 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 text-sm shadow disabled:opacity-60">
              <FontAwesomeIcon class="me-3" :icon="faFloppyDisk" />{{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
            <router-link to="/"
              class="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200">Cancel</router-link>
          </div>
        </div>
      </div>
    </div>
  </NotesLayout>
</template>
