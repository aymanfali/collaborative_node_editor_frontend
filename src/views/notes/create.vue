<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold mb-4">Create New Note</h1>
            <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded">
                Back to Notes
            </button>
        </div>

        <div class="flex gap-3 m-4">
            <input v-model="title" type="text" placeholder="Note Title" class="border p-2 rounded w-full mb-2" />
            <button @click="saveNote" class="bg-blue-500 text-white px-4 py-2 rounded" :disabled="!title.trim()">
                Save Note
            </button>
        </div>

        <TextEditor v-model="content" />

        <div v-if="loading" class="mt-2 text-gray-500">Saving...</div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import TextEditor from "../../components/TextEditor.vue";
import api from "../../services/api";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const title = ref("");
const content = ref("");
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const saveNote = async () => {
    if (!title.value.trim()) return;

    loading.value = true;
    try {
        const res = await api.post("/notes", {
            title: title.value,
            content: content.value,
        });
        toast.success("Note created successfully!");
        router.push({ name: "note-show", params: { id: res.data._id } });
    } catch (err) {
        console.error(err);
        toast.error("Failed to save note.");
    } finally {
        loading.value = false;
    }
};

const goBack = () => router.push({ name: "notes" });
</script>
