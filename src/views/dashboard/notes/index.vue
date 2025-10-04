<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Table from '@/components/Dashboard/Table.vue';
import api from '@/services/api.js';

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

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get('/notes');
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
});

function handleView(item: NoteRow) {
  if (!item?._id) return;
  router.push(`/notes/${item._id}`);
}
</script>
<template>
  <section>
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Notes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <Table
      v-else
      :headers="['Title','Owner','Email','Date']"
      :items="notes"
      :filterableColumns="[
        { key: 'title', label: 'Title' },
        { key: 'owner', label: 'Owner' },
        { key: 'email', label: 'Email' },
        { key: 'date', label: 'Date', type: 'date' },
      ]"
      :allowEdit="false"
      :showDelete="true"
      :showView="true"
      :showExport="true"
      @view="handleView"
    />
  </section>
</template>
