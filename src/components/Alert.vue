<template>
    <div v-if="visible" :class="['p-4 rounded mb-4', typeClass]" class="transition-all duration-300">
        {{ message }}
        <button @click="close" class="me-4 font-bold">✕</button>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    message: { type: String, required: true },
    type: { type: String, default: "info" }, // info, success, error, warning
    duration: { type: Number, default: 3000 },
});

const visible = ref(true);

const typeClass = computed(() => {
    switch (props.type) {
        case "success":
            return "bg-green-100 text-green-800 border border-green-300";
        case "error":
            return "bg-red-100 text-red-800 border border-red-300";
        case "warning":
            return "bg-yellow-100 text-yellow-800 border border-yellow-300";
        default:
            return "bg-blue-100 text-blue-800 border border-blue-300";
    }
});

const close = () => (visible.value = false);

// Auto-dismiss
watch(visible, (v) => {
    if (v) setTimeout(() => (visible.value = false), props.duration);
});
</script>

<style scoped>
button {
    background: transparent;
    border: none;
    cursor: pointer;
}
</style>
