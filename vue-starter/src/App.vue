<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <main>
    <h1>Vue + Vite</h1>
    <button type="button" @click="count++">Count is {{ count }}</button>
    <p>Edit <code>src/App.vue</code>: the page updates and the count stays.</p>
  </main>
</template>

<style scoped>
main {
  font-family: system-ui, sans-serif;
  text-align: center;
  margin-top: 3rem;
}
button {
  font: inherit;
  padding: 0.4rem 1rem;
}
</style>
