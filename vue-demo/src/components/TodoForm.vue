<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ add: [text: string] }>();
const text = ref("");

function submit() {
  const value = text.value.trim();
  if (!value) return;
  emit("add", value);
  text.value = "";
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="text" placeholder="What needs doing?" />
    <button>Add</button>
  </form>
</template>
