<template>
    <div id="container">
        <div ref="editor"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});

const editor = ref(null);
let quill = null;

const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ['link', 'image', 'formula', 'blockquote', 'code-block'],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'align': [] }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    ['clean']                                         // remove formatting button
];

onMounted(() => {
    quill = new Quill(editor.value, {
        modules: {
            toolbar: toolbarOptions
        },
        theme: "snow",
    });

    quill.root.innerHTML = props.modelValue;

    // Emit changes
    quill.on("text-change", () => {
        const html = quill.getText().trim() ? quill.root.innerHTML : "";
        emit("update:modelValue", html);
    });
});
</script>
