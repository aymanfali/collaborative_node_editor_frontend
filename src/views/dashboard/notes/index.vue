<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-3">Notes</h1>
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
    />
  </section>
</template>
