<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Table from '@/components/Dashboard/Table.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import api from '@/services/api.js';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type NoteRow = {
  title: string;
  owner: string;
  email: string;
  date: string;
  _id: string;
};

const notes = ref<NoteRow[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();
const search = ref('');
let searchTimer: any = null;

// confirm modal state for delete
const showConfirm = ref(false);
const deletingNote = ref<NoteRow | null>(null);
const deleting = ref(false);

async function fetchNotes(q = '') {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get('/notes', { params: q ? { q } : {} });
    const list = Array.isArray(res.data) ? res.data : [];
    notes.value = list.map((n: any) => ({
      title: n.title,
      owner: n.owner?.name || '-',
      email: n.owner?.email || '-',
      date: n.createdAt,
      _id: n._id,
    }));
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load notes';
  } finally {
    loading.value = false;
  }
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => fetchNotes(search.value.trim()), 300);
}

onMounted(async () => {
  loading.value = true;
  error.value = '';
  await fetchNotes();
});

function handleView(item: NoteRow) {
  if (!item?._id) return;
  router.push(`/notes/${item._id}`);
}

function handleDelete(item: NoteRow) {
  deletingNote.value = item;
  showConfirm.value = true;
}

async function confirmDelete() {
  if (!deletingNote.value?._id) return;
  deleting.value = true;
  try {
    await api.delete(`/notes/${deletingNote.value._id}`);
    await fetchNotes(search.value.trim());
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to delete note';
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <section>
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">{{ $t('nav.notes') }}</h1>
    <div class="flex items-center gap-3 mb-4">
      <FontAwesomeIcon class="dark:text-white text-black" :icon="faMagnifyingGlass" />
      <input v-model="search" @input="onSearchInput" type="text" :placeholder="$t('placeholders.searchNotes')"
        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full" />
    </div>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <Table v-else :headers="[
        { key: 'title', label: $t('table.headers.title') },
        { key: 'owner', label: $t('table.headers.owner') },
        { key: 'email', label: $t('table.headers.email') },
        { key: 'date', label: $t('table.headers.date') }
      ]" :items="notes" :filterableColumns="[
        { key: 'title', label: $t('table.headers.title') },
        { key: 'owner', label: $t('table.headers.owner') },
        { key: 'email', label: $t('table.headers.email') },
        { key: 'date', label: $t('table.headers.date'), type: 'date' }
      ]" :allowEdit="false" :showDelete="true" :showView="true" :showExport="true" @view="handleView" @delete="handleDelete" />

    <ConfirmModal
      v-model:show="showConfirm"
      :title="$t('confirm.deleteNoteTitle')"
      :message="$t('confirm.deleteConfirmNote', { title: deletingNote?.title || '' })"
      :confirmText="$t('confirm.confirm')"
      :cancelText="$t('confirm.cancel')"
      :destructive="true"
      @confirm="confirmDelete"
    />
  </section>
</template>
