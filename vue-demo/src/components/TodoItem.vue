<script setup lang="ts">
import type { Todo } from "../stores/todos";

defineProps<{ todo: Todo }>();
defineEmits<{ remove: [] }>();
</script>

<template>
  <li :class="{ done: todo.done }">
    <label><input v-model="todo.done" type="checkbox" /> {{ todo.text }}</label>
    <button type="button" @click="$emit('remove')">x</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}
.done label {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
