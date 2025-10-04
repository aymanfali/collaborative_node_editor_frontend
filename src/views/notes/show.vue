<template>
  <NotesLayout>
    <section>
      <!-- Gradient page header -->
      <div class="mb-5">
        <div class="rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white p-5 shadow">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 class="text-2xl font-semibold">Edit Note</h1>
              <p class="text-white/70 text-sm">Manage content and collaborators</p>
            </div>
            <div class="flex gap-2 flex-wrap justify-end">
              <span v-if="!canEdit" class="px-3 py-2 rounded bg-white/10 text-white text-sm">View only</span>
              <button @click="saveNote" :disabled="!canEdit || !isChanged || !note.title.trim() || saving"
                class="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow disabled:opacity-60">
                <FontAwesomeIcon class="me-3" :icon="faFloppyDisk" /> {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <!-- Export buttons -->
              <div class="flex items-center gap-2 bg-white/10 rounded-md p-1">
                <button @click="downloadExport('md')" :disabled="loading"
                  class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow disabled:opacity-60"
                  title="Export Markdown">
                  <FontAwesomeIcon class="me-3" :icon="faMarkdown" />MD
                </button>
                <button @click="downloadExport('html')" :disabled="loading"
                  class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow disabled:opacity-60"
                  title="Export HTML">
                  <FontAwesomeIcon class="me-3" :icon="faHtml5" />HTML
                </button>
                <button @click="downloadExport('pdf')" :disabled="loading"
                  class="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow disabled:opacity-60"
                  title="Export PDF">
                  <FontAwesomeIcon class="me-3" :icon="faFilePdf" />PDF
                </button>
              </div>
              <button @click="goBack"
                class="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow">
                <FontAwesomeIcon class="me-3" :icon="faArrowLeft" /> Back to Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card container for editor and collaborators -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div v-if="loading" class="text-slate-600 dark:text-slate-300">Loading note...</div>
        <div v-else-if="error" class="text-rose-600">{{ error }}</div>

        <div v-else>
          <input v-model="note.title" :disabled="!canEdit" type="text" placeholder="Note Title"
            class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full mb-3 disabled:bg-gray-100 disabled:text-gray-500" />

          <!-- Presence bar -->
          <div class="flex items-center gap-2 mb-2" v-if="presence.length">
            <div v-for="p in presence" :key="presenceKey(p)" class="flex items-center gap-1">
              <span class="inline-flex items-center justify-center rounded-full text-white text-xs w-6 h-6"
                :style="{ backgroundColor: presenceColor(p) || '#64748b' }" :title="presenceDisplayName(p)">
                {{ presenceInitials(p) }}
              </span>
            </div>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ presence.length }} online</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <!-- Editor column -->
            <div class="lg:col-span-2">
              <TextEditor v-model="note.content" :read-only="!canEdit" :note-id="route.params.id" :user="currentUser"
                @presence="onPresence" />
            </div>

            <!-- Collaborators sidebar -->
            <aside
              class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm h-max">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-medium text-slate-800 dark:text-slate-100">Collaborators</h2>
                <span class="text-sm text-slate-500 dark:text-slate-400" v-if="loadingCollabs">Loading...</span>
              </div>

              <div v-if="canManageCollabs" class="mb-4 flex flex-col gap-2">
                <input v-model="inviteEmail" type="email" placeholder="Invite by email"
                  class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full" />
                <select v-model="invitePermission"
                  class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full">
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                </select>
                <button @click="addOrUpdateCollaborator" :disabled="!inviteEmail"
                  class="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm shadow disabled:opacity-60">
                  Invite / Update
                </button>
              </div>

              <div v-if="collaborators.length === 0" class="text-sm text-slate-500 dark:text-slate-400">
                No collaborators yet.
              </div>
              <ul class="divide-y divide-gray-200 dark:divide-gray-800">
                <li v-for="c in collaborators" :key="normId(c.user)" class="p-3 my-3 flex flex-col gap-4 border border-slate-300/20">
                  <div>
                    <div class="font-medium text-slate-800 dark:text-slate-100">{{ c.user.name || c.user.email }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ c.user.email }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <select :disabled="!canManageCollabs"
                      class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-slate-200 py-2 px-3 rounded"
                      :value="c.permission" @change="onChangePermission(c, $event.target.value)">
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                    </select>
                    <button v-if="canManageCollabs" @click="removeCollaborator(normId(c.user))"
                      class="px-3 py-2 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm">
                      Remove
                    </button>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </NotesLayout>
</template>

<script setup>
import NotesLayout from '@/layouts/NotesLayout.vue';
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../services/api";
import TextEditor from "../../components/TextEditor.vue";
import { useToast } from "vue-toastification";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowLeft, faFilePdf, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faHtml5, faMarkdown } from '@fortawesome/free-brands-svg-icons';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const note = reactive({ title: "", content: "", owner: null });
const originalNote = reactive({ title: "", content: "" });
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const isChanged = ref(false);
const collaborators = ref([]);
const loadingCollabs = ref(false);
const inviteEmail = ref("");
const invitePermission = ref("view");
const currentUser = ref(null);
const presence = ref([]);
const serverCanEdit = ref(false);
const serverCanManage = ref(false);

// Normalize IDs
function normId(u) {
  if (!u) return '';
  if (typeof u === 'string' || typeof u === 'number') return String(u);
  return String(u._id || u.id || u.userId || u.email || u.username || '');
}

// Normalize collaborator list
function normalizeCollaborators(list = []) {
  return list.map(item => {
    const permission = item.permission || item.perm || 'view';
    let user = item.user || item.userId || item.email || item || null;
    if (typeof user === 'string') {
      user = user.includes('@') ? { email: user } : { _id: user };
    }
    return {
      user: {
        _id: user._id || user.id || user.userId || null,
        email: user.email || null,
        name: user.name || null,
      },
      permission
    };
  });
}

// Permission checks
const canManageCollabs = computed(() => {
  if (serverCanManage.value) return true;
  if (currentUser.value?.role === 'admin') return true;
  const meId = normId(currentUser.value);
  const ownerId = normId(note.owner);
  return !!ownerId && ownerId === meId;
});

const canEdit = computed(() => {
  if (serverCanEdit.value) return true;
  if (currentUser.value?.role === 'admin') return true;
  const meId = normId(currentUser.value);
  const ownerId = normId(note.owner);
  if (ownerId && ownerId === meId) return true;
  const meEmail = (currentUser.value?.email || currentUser.value?.username || '').toLowerCase();
  const me = collaborators.value.find(c => {
    const collabId = normId(c.user);
    const collabEmail = (c.user?.email || '').toLowerCase();
    return ((collabId && collabId === meId) || (meEmail && collabEmail && collabEmail === meEmail));
  });
  return !!me && me.permission === 'edit';
});

// Fetch note
const fetchNote = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/notes/${route.params.id}`);
    note.title = res.data.title;
    note.content = res.data.content || "";
    note.owner = res.data.owner;
    originalNote.title = res.data.title;
    originalNote.content = res.data.content || "";
    error.value = null;
    // read server permission meta
    const meta = res.data?.__meta || {};
    serverCanEdit.value = !!meta.canEdit;
    serverCanManage.value = !!meta.canManage;
    // Only fetch collaborators if the user can manage collaborators (owner/admin)
    if (serverCanManage.value) {
      await fetchCollaborators();
    } else {
      collaborators.value = [];
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch note.";
    toast.error("Failed to fetch note.");
  } finally {
    loading.value = false;
  }
};

// Save note
const saveNote = async () => {
  if (!canEdit.value || !note.title.trim() || !isChanged.value) return;
  saving.value = true;
  error.value = null;
  try {
    const res = await api.put(`/notes/${route.params.id}`, {
      title: note.title,
      content: note.content,
    });
    originalNote.title = res.data.title;
    originalNote.content = res.data.content || "";
    isChanged.value = false;
    toast.success("Note saved successfully!");
  } catch (err) {
    console.error(err);
    error.value = "Failed to save note.";
    toast.error("Failed to save note.");
  } finally {
    saving.value = false;
  }
};

const goBack = () => router.push({ name: "notes" });

// Collaborators
async function fetchCollaborators() {
  try {
    loadingCollabs.value = true;
    const res = await api.get(`/notes/${route.params.id}/collaborators`);
    collaborators.value = normalizeCollaborators(res.data || []);
  } catch (_) {
    // silent for viewers without access
  } finally {
    loadingCollabs.value = false;
  }
}

async function addOrUpdateCollaborator() {
  try {
    const res = await api.post(`/notes/${route.params.id}/collaborators`, {
      email: inviteEmail.value, permission: invitePermission.value
    });
    collaborators.value = normalizeCollaborators(res.data || []);
    inviteEmail.value = "";
    toast.success('Collaborator updated');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to invite/update');
  }
}

async function onChangePermission(c, perm) {
  try {
    const res = await api.post(`/notes/${route.params.id}/collaborators`, {
      email: c.user.email, permission: perm
    });
    collaborators.value = normalizeCollaborators(res.data || []);
    toast.success('Permission updated');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update permission');
  }
}

async function removeCollaborator(userId) {
  try {
    await api.delete(`/notes/${route.params.id}/collaborators/${userId}`);
    collaborators.value = collaborators.value.filter(c => normId(c.user) !== String(userId));
    toast.success('Collaborator removed');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove');
  }
}

// Watch changes
watch(() => [note.title, note.content], ([newTitle, newContent]) => {
  isChanged.value = newTitle !== originalNote.title || newContent !== originalNote.content;
});

// Presence
function onPresence(list) {
  presence.value = Array.isArray(list) ? list : [];
}

// Presence helpers
function presenceKey(p) {
  // prefer userId then email then fallback to name
  if (!p) return JSON.stringify(p);
  return p.userId || p.id || p.email || (p.name ? p.name.replace(/\s+/g, '_') : JSON.stringify(p));
}

function presenceDisplayName(p) {
  if (!p) return 'User';
  return p.name || p.displayName || p.email || 'User';
}

function presenceInitials(p) {
  const name = presenceDisplayName(p) || 'User';
  // extract letters and take first 2
  const clean = String(name).replace(/[^A-Za-z ]/g, '').trim();
  if (!clean) return 'U';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

function presenceColor(p) {
  return p && (p.color || p.col || p.colorHex) ? (p.color || p.col || p.colorHex) : null;
}

// Debug
watch(
  () => ({ collabs: collaborators.value, me: currentUser.value, owner: note.owner }),
  (state) => {
    try {
      const meId = normId(state.me);
      const ownerId = normId(state.owner);
      const meEmail = (state.me?.email || state.me?.username || '').toLowerCase();
      const matched = (collaborators.value || []).find(c => {
        const collabId = normId(c.user);
        const collabEmail = (c.user?.email || '').toLowerCase();
        return (collabId && collabId === meId) || (meEmail && collabEmail && collabEmail === meEmail);
      });
      console.debug('[notes/show] canEdit debug', {
        meId,
        meEmail,
        ownerId,
        matchedCollab: matched ? { id: normId(matched.user), email: matched.user?.email, permission: matched.permission } : null,
        canEdit: !!(currentUser.value?.role === 'admin' || (ownerId && ownerId === meId) || (matched && matched.permission === 'edit')),
      });
    } catch (_) { }
  },
  { deep: true, immediate: true }
);

// Export
function sanitizeFilename(name = 'note') {
  return String(name)
    .trim()
    .replace(/[\n\r\t]/g, ' ')
    .replace(/[^a-zA-Z0-9 _.-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100) || 'note'
}

async function downloadExport(ext) {
  try {
    if (!route?.params?.id) return;
    const url = `/notes/${route.params.id}/export.${ext}`
    const res = await api.get(url, { responseType: 'blob' })
    const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' })
    const cd = res.headers['content-disposition'] || ''
    const match = /filename\s*=\s*"?([^";]+)"?/i.exec(cd)
    const fallback = `${sanitizeFilename(note.title || 'note')}.${ext}`
    const fileName = match?.[1] || fallback
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(link.href), 2000)
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to export')
  }
}

// Init
onMounted(async () => {
  try {
    currentUser.value = JSON.parse(localStorage.getItem('activeUser')) || null;
  } catch (_) { currentUser.value = null; }
  await fetchNote();
});
</script>
