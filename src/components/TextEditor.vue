<template>
    <div id="container">
        <div ref="editor"></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
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

onUnmounted(() => {
    if (socket) {
        socket.disconnect();
    }
});
</script>
