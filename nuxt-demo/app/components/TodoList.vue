<script setup lang="ts">
defineProps<{ todos: { id: number; text: string }[] }>();
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
  </ul>
</template>
