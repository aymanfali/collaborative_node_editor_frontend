<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold mb-4">Your Notes</h1>
            <button @click="goToCreate" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Create New Note
            </button>
        </div>

        <div v-if="loading">Loading notes...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else-if="notes.length === 0" class="text-gray-500 italic">
            No notes yet. Create your first one above!
        </div>

        <ul class="space-y-2">
            <li v-for="note in notes" :key="note._id" class="p-3 border rounded flex justify-between items-center">
                <router-link v-if="note?._id" :to="{ name: 'note-show', params: { id: note._id } }"
                    class="text-blue-600 font-semibold">
                    {{ note.title }}
                </router-link>
                <button @click="deleteNote(note._id)" class="text-red-500">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";
import { useToast } from "vue-toastification";

const notes = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();
const toast = useToast();

const fetchNotes = async () => {
    loading.value = true;
    try {
        const res = await api.get("/notes");
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

const deleteNote = async (id) => {
    const oldNotes = [...notes.value];
    notes.value = notes.value.filter((n) => n._id !== id);
    try {
        await api.delete(`/notes/${id}`);
        toast.success("Note deleted successfully!");
    } catch (err) {
        notes.value = oldNotes;
        toast.error("Failed to delete note.");
        console.error("Error deleting note:", err);
    }
};

const goToCreate = () => router.push({ name: "note-create" });

onMounted(fetchNotes);
</script>
