<script setup lang="ts">
const visits = useState("visits", () => 0);
onMounted(() => visits.value++);
const { todos } = useTodos();
</script>

<template>
  <main>
    <h1>About</h1>
    <p>
      {{ todos.length }} todos, the same list as on the first page: a composable
      over <code>useState</code>.
    </p>
    <p>
      Every file in <code>app/pages/</code> is a route, and
      <code>app/components/</code> and <code>app/composables/</code> are
      imported where they're used. Open Nuxt DevTools to see them.
    </p>
  </main>
</template>
