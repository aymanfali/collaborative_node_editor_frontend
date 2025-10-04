<script setup>
import { ref, onMounted } from 'vue';
import Table from '@/components/Dashboard/Table.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import api from '@/services/api.js';

const users = ref([]);
const loading = ref(true);
const error = ref('');

// confirm modal state
const showConfirm = ref(false);
const deletingUser = ref(null);
const deleting = ref(false);

async function fetchUsers() {
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
}

onMounted(fetchUsers);

function handleDelete(user) {
  deletingUser.value = user;
  showConfirm.value = true;
}

// Optional: handle viewing a user (no dedicated page yet)
function handleView(_user) {
  // You can navigate to a user profile page here if available
}

async function confirmDelete() {
  if (!deletingUser.value?._id) return;
  deleting.value = true;
  try {
    await api.delete(`/admin/users/${deletingUser.value._id}`);
    await fetchUsers();
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to delete user';
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <section>
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <Table v-else :headers="['Avatar','Name','Email','Provider','Role','Date']" :items="users" :filterableColumns="[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'provider', label: 'Provider' },
        { key: 'role', label: 'Role' },
        { key: 'date', label: 'Date', type: 'date' },
      ]" :allowEdit="false" :showDelete="true" :showView="false" :showExport="false" @view="handleView" @delete="handleDelete" />

    <ConfirmModal
      v-model:show="showConfirm"
      title="Delete User"
      :message="`Are you sure you want to delete user ${deletingUser?.name || ''}? This action cannot be undone.`"
      confirmText="Delete"
      cancelText="Cancel"
      :destructive="true"
      @confirm="confirmDelete"
    />
  </section>
</template>
