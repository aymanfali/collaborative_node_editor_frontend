<template>
    <NotesLayout>
        <section>
            <NotesHero title="Your Notes" subtitle="Create, edit and collaborate">
                <template #actions>
                    <button @click="goToCreate"
                        class="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white text-sm shadow">
                        <FontAwesomeIcon class="me-3" :icon="faPlus" />Create New Note
                    </button>
                </template>
            </NotesHero>

            <div class="flex items-center gap-3 mb-4 mt-12">
                <FontAwesomeIcon class="dark:text-white" :icon="faMagnifyingGlass" />
                <input v-model="search" @input="onSearchInput" type="text"
                    placeholder="Search notes (title and content)"
                    class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full" />
            </div>

            <div v-if="loading" class="text-slate-600 dark:text-slate-300">Loading notes...</div>
            <div v-else-if="error" class="text-rose-600">{{ error }}</div>
            <div v-else-if="notes.length === 0" class="text-slate-500 dark:text-slate-400 italic">No notes yet. Create
                your first one above!</div>

            <ul class="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <li v-for="note in notes" :key="note._id"
                    class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-sm flex items-center justify-between">
                    <div class="flex items-center">
                        <FontAwesomeIcon class="me-3 dark:text-white" size="3x" :icon="faNoteSticky" />
                        <div class="pr-3">
                            <router-link v-if="note?._id" :to="{ name: 'note-show', params: { id: note._id } }"
                                class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                {{ note.title }}
                            </router-link>
                            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <FontAwesomeIcon class="me-3" :icon="faUser" /> {{ note.owner?.name || note.owner?.email
                                ||
                                'Unknown' }}
                            </div>
                            <div class="text-xs my-2 text-slate-500 dark:text-slate-400">
                                Last updated: {{ formatDateTime(note.updatedAt) }}
                            </div>
                        </div>
                    </div>
                    <button @click="confirmDelete(note)"
                        class="p-2 m-2 rounded-md bg-white/10 shadow text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm">
                        <FontAwesomeIcon class="" :icon="faTrash" />
                    </button>
                </li>
            </ul>

            <ConfirmModal v-model:show="isConfirmOpen" title="Delete note"
                message="Are you sure you want to permanently delete this note? This action cannot be undone."
                confirmText="Delete" cancelText="Cancel" destructive @confirm="performDelete" />
        </section>
    </NotesLayout>
</template>

<script setup>
import NotesLayout from '@/layouts/NotesLayout.vue';
import NotesHero from '@/components/NotesHero.vue';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";
import { useToast } from "vue-toastification";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass, faNoteSticky, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '@/components/ConfirmModal.vue';

const notes = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();
const toast = useToast();
const search = ref('');
let searchTimer = null;

function formatDateTime(val) {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString();
    } catch (e) {
        return String(val);
    }
}

const fetchNotes = async (q = '') => {
    loading.value = true;
    try {
        const res = await api.get("/notes", { params: q ? { q } : {} });
        notes.value = res.data;
        error.value = null;
    } catch (err) {
        error.value = "Failed to fetch notes.";
        toast.error("Failed to fetch notes.");
        console.error(err);
    } finally {
        loading.value = false;
    }
};

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => fetchNotes(search.value.trim()), 300);
}

// confirmation flow
const isConfirmOpen = ref(false);
const noteToDelete = ref(null);

const confirmDelete = (note) => {
    noteToDelete.value = note;
    isConfirmOpen.value = true;
};

const performDelete = async () => {
    if (!noteToDelete.value) return;
    const id = noteToDelete.value._id;
    const oldNotes = [...notes.value];
    // optimistically remove
    notes.value = notes.value.filter((n) => n._id !== id);
    try {
        await api.delete(`/notes/${id}`);
        toast.success("Note deleted successfully!");
    } catch (err) {
        notes.value = oldNotes;
        toast.error("Failed to delete note.");
        console.error("Error deleting note:", err);
    } finally {
        noteToDelete.value = null;
    }
};

const goToCreate = () => router.push({ name: "note-create" });

onMounted(() => fetchNotes());
</script>
