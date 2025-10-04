<template>
    <div id="container" :class="[readOnly ? 'opacity-90' : '', 'rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800']">
        <div ref="editor"></div>
    </div>
    
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:modelValue"]);

const editor = ref(null);
let quill = null;
let socket = null;

const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    ["link", "image", "formula", "blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    ["clean"],
];

onMounted(() => {
    quill = new Quill(editor.value, {
        modules: { toolbar: toolbarOptions },
        theme: "snow",
        readOnly: props.readOnly,
    });

    // Load initial content
    if (props.modelValue) {
        quill.clipboard.dangerouslyPasteHTML(props.modelValue);
    }

    // init socket
    socket = io("http://localhost:3000");

    // Local -> emit
    quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
            const html = quill.root.innerHTML;
            emit("update:modelValue", html);

            // send delta to server
            socket.emit("editor-changes", delta);
        }
    });

    // Remote -> apply
    socket.on("editor-changes", (delta) => {
        quill.updateContents(delta);
    });
});

// react to readOnly changes
watch(() => props.readOnly, (ro) => {
    if (quill) {
        quill.enable(!ro);
    }
});

onUnmounted(() => {
    if (socket) {
        socket.disconnect();
    }
});
</script>

<style scoped>
/* Quill theming alignment with dashboard/notes look */
:deep(.ql-toolbar.ql-snow) {
    border: 1px solid var(--color-gray, #e5e7eb);
    background-color: var(--color-bg, #f8fafc);
  border-bottom: none;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

:deep(.ql-container.ql-snow) {
    border: 1px solid var(--color-gray, #e5e7eb);
    border-top: none;
    background-color: var(--color-bg, transparent);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  min-height: 320px;
}

</style>
