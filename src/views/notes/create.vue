<template>
    <NotesLayout>
        <section>
            <!-- Gradient header -->
            <div class="mb-5">
                <div class="rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white p-5 shadow">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 class="text-2xl font-semibold">Create New Note</h1>
                            <p class="text-white/70 text-sm">Start a new idea and collaborate later</p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="saveNote"
                                class="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow disabled:opacity-60"
                                :disabled="!title.trim() || loading">
                                <FontAwesomeIcon class="me-3" :icon="faFloppyDisk" /> {{ loading ? 'Saving…' : 'Save' }}
                            </button>
                            <button @click="goBack"
                                class="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm shadow">
                                <FontAwesomeIcon class="me-3" :icon="faArrowLeft" /> Back to Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card container -->
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div class="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                        v-model="title"
                        @input="touched.title = true"
                        type="text"
                        placeholder="Note Title"
                        :aria-invalid="!!titleError || undefined"
                        :aria-describedby="titleError ? 'note-title-error' : undefined"
                        :class="[
                          'bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200 py-2 px-3 rounded w-full',
                          titleError ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500'
                        ]"
                    />
                </div>
                <p v-if="titleError" id="note-title-error" class="-mt-3 mb-3 text-xs text-rose-500">{{ titleError }}</p>

                <TextEditor v-model="content" />
            </div>
        </section>
    </NotesLayout>

</template>

<script setup>
import NotesLayout from '@/layouts/NotesLayout.vue';
import { ref, computed } from "vue";
import TextEditor from "../../components/TextEditor.vue";
import api from "../../services/api";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const title = ref("");
const content = ref("");
const loading = ref(false);
const touched = ref({ title: false });
const router = useRouter();
const toast = useToast();

const titleError = computed(() => {
    if (!touched.value.title) return '';
    const v = title.value.trim();
    if (!v) return 'Title is required';
    if (v.length > 200) return 'Title must be 200 characters or less';
    return '';
});

const saveNote = async () => {
    if (!title.value.trim()) {
        touched.value.title = true;
        return;
    }

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
