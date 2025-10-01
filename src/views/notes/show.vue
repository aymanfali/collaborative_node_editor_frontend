<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold mb-4">Edit Note</h1>
            <div class="m-4 flex gap-2">
                <div class="mt-4 flex gap-2">
                    <button @click="saveNote" :disabled="!isChanged || !note.title.trim() || saving"
                        class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
                        {{ saving ? "Saving..." : "Save Note" }}
                    </button>
                    <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded">
                        Back to Notes
                    </button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-gray-500">Loading note...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else>
            <input v-model="note.title" type="text" placeholder="Note Title" class="border p-2 rounded w-full mb-2" />
            <TextEditor v-model="note.content" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../services/api";
import TextEditor from "../../components/TextEditor.vue";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const note = reactive({ title: "", content: "" });
const originalNote = reactive({ title: "", content: "" });
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const isChanged = ref(false);

// Fetch note from backend
const fetchNote = async () => {
    loading.value = true;
    try {
        const res = await api.get(`/notes/${route.params.id}`);
        note.title = res.data.title;
        note.content = res.data.content || "";
        originalNote.title = res.data.title;
        originalNote.content = res.data.content || "";
        error.value = null;
    } catch (err) {
        console.error(err);
        error.value = "Failed to fetch note.";
        toast.error("Failed to fetch note.");
    } finally {
        loading.value = false;
    }
};

// Watch for changes to enable Save button
watch(
    () => [note.title, note.content],
    ([newTitle, newContent]) => {
        isChanged.value =
            newTitle !== originalNote.title || newContent !== originalNote.content;
    }
);

const saveNote = async () => {
    if (!note.title.trim() || !isChanged.value) return;

    saving.value = true;
    error.value = null;

    try {
        const res = await api.put(`/notes/${route.params.id}`, {
            title: note.title,
            content: note.content,
        });
        // Update originalNote to reflect saved state
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

onMounted(fetchNote);
</script>
