<template>
    <div id="container" :class="[readOnly ? 'opacity-90' : '', 'rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 relative']">
        <div ref="editor"></div>
        <!-- Remote cursor overlay container -->
        <div ref="overlay" class="pointer-events-none absolute inset-0"></div>
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
    noteId: {
        type: [String, Number],
        required: true,
    },
    user: {
        type: Object,
        default: () => ({}),
    }
});
const emit = defineEmits(["update:modelValue", "presence"]);

const editor = ref(null);
const overlay = ref(null);
let quill = null;
let socket = null;
const remoteCursors = new Map(); // userId -> HTMLElement

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

    // join room for this note
    socket.emit("join-note", { noteId: String(props.noteId), user: props.user });

    // Local -> emit
    quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
            const html = quill.root.innerHTML;
            emit("update:modelValue", html);

            // send delta to server
            socket.emit("editor-changes", { noteId: String(props.noteId), delta });
        }
    });

    // Local selection -> cursor update
    quill.on("selection-change", (range, oldRange, source) => {
        if (source !== "user") return;
        if (!range) return;
        const cursor = {
            userId: props.user?.id || props.user?._id || socket.id,
            name: props.user?.name || props.user?.email || "Me",
            color: props.user?.color || "#22c55e",
            index: range.index,
            length: range.length || 0,
        };
        socket.emit("cursor-update", { noteId: String(props.noteId), cursor });
    });

    // Remote -> apply
    socket.on("editor-changes", (delta) => {
        quill.updateContents(delta);
    });

    // Presence updates -> emit to parent
    socket.on("presence", (list) => {
        emit("presence", Array.isArray(list) ? list : []);
    });

    // Remote cursor updates
    socket.on("cursor-update", (cursor) => {
        if (!cursor || !overlay.value) return;
        const { userId, color, index } = cursor;
        if (userId === (props.user?.id || props.user?._id)) return; // ignore self
        const bounds = quill.getBounds(Math.max(0, index));
        renderRemoteCaret(userId, bounds, color, cursor.name);
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
        socket.emit("leave-note", { noteId: String(props.noteId) });
        socket.disconnect();
    }
    // cleanup cursors
    for (const el of remoteCursors.values()) {
        if (el && el.remove) el.remove();
    }
    remoteCursors.clear();
});

function renderRemoteCaret(userId, bounds, color = "#22c55e", name = "") {
    let el = remoteCursors.get(userId);
    if (!el) {
        el = document.createElement("div");
        el.className = "remote-caret";
        el.style.position = "absolute";
        el.style.width = "0";
        el.style.borderLeft = `2px solid ${color}`;
        el.style.zIndex = 10;
        // label
        const label = document.createElement("div");
        label.className = "remote-caret-label";
        label.style.position = "absolute";
        label.style.top = "-16px";
        label.style.left = "-2px";
        label.style.fontSize = "10px";
        label.style.padding = "2px 4px";
        label.style.background = color;
        label.style.color = "#fff";
        label.style.borderRadius = "3px";
        label.style.whiteSpace = "nowrap";
        label.textContent = name || "Collaborator";
        el.appendChild(label);
        overlay.value.appendChild(el);
        remoteCursors.set(userId, el);
    }
    el.style.left = `${bounds.left}px`;
    el.style.top = `${bounds.top}px`;
    el.style.height = `${bounds.height}px`;
}
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

.remote-caret {
  transition: top 0.05s linear, left 0.05s linear;
}

</style>
