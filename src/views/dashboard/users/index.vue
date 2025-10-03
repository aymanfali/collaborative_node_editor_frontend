<script setup>
import { ref, onMounted } from 'vue';
import Table from '@/components/Dashboard/Table.vue';
import api from '@/services/api.js';

const users = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get('/admin/users');
    users.value = (res.data || []).map(u => ({
      name: u.name,
      email: u.email,
      provider: u.provider,
      role: u.role,
      date: u.createdAt,
      avatar: u.avatar,
      _id: u._id,
    }));
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load users';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-3">Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <Table
      v-else
      :headers="['Avatar','Name','Email','Provider','Role','Date']"
      :items="users"
      :filterableColumns="[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'provider', label: 'Provider' },
        { key: 'role', label: 'Role' },
        { key: 'date', label: 'Date', type: 'date' },
      ]"
    />
  </section>
</template>
