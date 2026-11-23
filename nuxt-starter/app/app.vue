<script setup lang="ts">
// `ref` needs no import: Nuxt imports Vue's APIs (and its own) where they're used.
const count = ref(0);
</script>

<template>
  <main>
    <h1>Nuxt</h1>
    <button type="button" @click="count++">Count is {{ count }}</button>
    <p>Edit <code>app/app.vue</code>: the page updates and the count stays.</p>
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
