<template>
  <Teleport to="body">
    <ul v-if="toastStore.toasts.length" class="toaster__wrapper">
      <li v-for="toast in toastStore.toasts" :class="['toaster__inner', toastClassMap[toast.status]]" :key="toast.id">
        <Icon :name="toastIconMap[toast.status]" class="toaster__inner-icon" />

        <span class="toaster__inner-text">
          {{ toast.text }}
        </span>
      </li>
    </ul>
  </Teleport>
</template>

<script setup>
import useToasterStore from "@/stores/useToasterStore";

const toastClassMap = {
  warning: "warning",
  error: "error",
  success: "success",
};

const toastIconMap = {
  error: "toast-error",
  warning: "toast-warning",
  success: "toast-success",
};

const toastStore = useToasterStore();
</script>

<style scoped>
.toaster__wrapper {
  position: fixed;
  bottom: 3%;
  right: 5%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toaster__inner {
  --color: black;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.3rem;
  border: 1px solid transparent;
  background-color: white;
  padding: 2.2rem 1.6rem;
  border-color: var(--color);
  color: var(--color);
}

.toaster__inner svg {
  fill: var(--color);
  stroke: var(--color);
}

.toaster__inner.success {
  --color: green;
}

.toaster__inner.warning {
  --color: orange;
}

.toaster__inner.error {
  --color: red;
}

.toaster__inner-icon {
  width: 1.8rem;
  aspect-ratio: 1/1;
}

.toaster__inner-text {
  font-size: 1.6rem;
  font-weight: 600;
}
</style>
