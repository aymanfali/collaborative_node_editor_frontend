<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import NotesLayout from '@/layouts/NotesLayout.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFloppyDisk, faUpload } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

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
const touched = ref({ name: false, avatar: false, password: false })

const avatarPreview = computed(() => form.avatar?.trim() || '/favicon.ico')

async function fetchMe() {
  loading.value = true
  try {
    const res = await api.get('/auth/me')
    const data = res.data?.data || null
    if (!data) throw new Error(t('common.loading'))
    user.value = data
    form.name = data.name || ''
    form.email = data.email || ''
    form.avatar = data.avatar || ''
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || t('common.loading'))
    router.push('/login')
  } finally {
    loading.value = false
  }
}

const nameError = computed(() => {
  if (!touched.value.name) return ''
  const v = (form.name || '').trim()
  if (!v) return t('validation.nameRequired')
  if (v.length < 3) return t('validation.nameMin')
  return ''
})
const avatarError = computed(() => {
  if (!touched.value.avatar) return ''
  const v = (form.avatar || '').trim()
  if (!v) return ''
  const ok = /^https?:\/\//i.test(v)
  return ok ? '' : t('validation.urlInvalid')
})
const passwordError = computed(() => {
  if (!touched.value.password) return ''
  const v = form.password || ''
  if (!v) return ''
  if (v.length < 6) return t('validation.passwordMin')
  return ''
})

const canSubmit = computed(() => {
  const vName = (form.name || '').trim()
  const vAvatar = (form.avatar || '').trim()
  const vPass = form.password || ''
  const avatarOk = !vAvatar || /^https?:\/\//i.test(vAvatar)
  const passOk = !vPass || vPass.length >= 6
  return vName.length >= 3 && avatarOk && passOk
})

async function save() {
  if (!canSubmit.value) {
    touched.value = { name: true, avatar: true, password: true }
    toast.error(t('validation.fixBeforeSaving'))
    return
  }
  saving.value = true
  try {
    const payload = { avatar: form.avatar, name: form.name }
    if (form.password && form.password.length >= 6) payload.password = form.password
    const res = await api.patch('/auth/me', payload)
    const updated = res.data?.data || null
    if (updated) {
      localStorage.setItem('activeUser', JSON.stringify(updated))
      toast.success(res.data?.message || t('profile.title') + ' ' + t('common.save'))
      form.password = ''
      touched.value.password = false
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || t('validation.fixBeforeSaving'))
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
        <h1 class="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">{{ $t('profile.title') }}</h1>
        <p class="text-slate-500 dark:text-slate-400">{{ $t('profile.subtitle') }}</p>
      </div>

      <div v-if="loading" class="text-slate-500 dark:text-slate-400">{{ $t('common.loading') }}</div>

      <div v-else
        class="bg-white dark:bg-slate-900/50 backdrop-blur rounded-xl border border-slate-200/70 dark:border-white/10 shadow-sm">
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img :src="avatarPreview" alt="Avatar preview"
              class="w-28 h-28 rounded-full object-cover ring-2 ring-blue-500/30 shadow-md" />
            <div class="flex-1 w-full">
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{{ $t('profile.avatarLabel') }}</label>
              <input
                v-model="form.avatar"
                @input="touched.avatar = true"
                type="url"
                placeholder="https://..."
                :aria-invalid="!!avatarError || undefined"
                :aria-describedby="avatarError ? 'avatar-error' : undefined"
                :class="[
                  'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2',
                  avatarError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-white/10 focus:ring-blue-500/50'
                ]"
              />
              <p v-if="avatarError" id="avatar-error" class="text-xs text-rose-500 mt-2">{{ avatarError }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ $t('profile.avatarHelp') }}</p>
              <div class="mt-3 flex items-center gap-2">
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
                <button type="button" @click="chooseFile" :disabled="uploading"
                  class="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white disabled:opacity-60">
                  <FontAwesomeIcon class="me-3" :icon="faUpload" />{{ uploading ? $t('profile.uploading') : $t('profile.uploadFromDevice') }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{{ $t('profile.nameLabel') }}</label>
              <input
                v-model="form.name"
                @input="touched.name = true"
                type="text"
                minlength="3"
                :aria-invalid="!!nameError || undefined"
                :aria-describedby="nameError ? 'name-error' : undefined"
                :class="[
                  'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2',
                  nameError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-white/10 focus:ring-blue-500/50'
                ]"
              />
              <p v-if="nameError" id="name-error" class="text-xs text-rose-500 mt-2">{{ nameError }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{{ $t('profile.emailLabel') }}</label>
              <input v-model="form.email" type="email" disabled
                class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300" />
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{{ $t('profile.newPasswordLabel') }}</label>
              <input
                v-model="form.password"
                @input="touched.password = true"
                type="password"
                minlength="6"
                :placeholder="$t('profile.newPasswordPlaceholder')"
                :aria-invalid="!!passwordError || undefined"
                :aria-describedby="passwordError ? 'password-error' : undefined"
                :class="[
                  'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2',
                  passwordError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 dark:border-white/10 focus:ring-blue-500/50'
                ]"
              />
              <p v-if="passwordError" id="password-error" class="text-xs text-rose-500 mt-2">{{ passwordError }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ $t('profile.newPasswordHelp') || '' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="block text-xs text-slate-500 dark:text-slate-400">{{ $t('profile.role') }}</span>
                <span class="block text-sm text-slate-800 dark:text-slate-200">{{ user?.role || '-' }}</span>
              </div>
              <div>
                <span class="block text-xs text-slate-500 dark:text-slate-400">{{ $t('profile.provider') }}</span>
                <span class="block text-sm text-slate-800 dark:text-slate-200">{{ user?.provider || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-3">
            <button @click="save" :disabled="saving || !canSubmit"
              class="inline-flex items-center px-4 py-2 rounded-md bg-slate-800/10 hover:bg-slate-800/20 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 text-sm shadow disabled:opacity-60">
              <FontAwesomeIcon class="me-3" :icon="faFloppyDisk" />{{ saving ? $t('common.saving') : $t('profile.saveChanges') }}
            </button>
            <router-link to="/"
              class="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200">{{ $t('profile.cancel') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </NotesLayout>
</template>
