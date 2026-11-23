<template>
  <div class="app">
    <nav>
      <NuxtLink to="/">Todos</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <span class="visits">{{ visits }} page views</span>
    </nav>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// useState is shared by every component and survives page changes: each page counts itself in.
const visits = useState("visits", () => 0);
</script>

<style>
body {
  font-family: system-ui, sans-serif;
}
.app {
  max-width: 32rem;
  margin: 2rem auto;
}
nav {
  display: flex;
  gap: 1rem;
  align-items: baseline;
}
nav .router-link-active {
  font-weight: 600;
}
.visits {
  margin-left: auto;
  opacity: 0.6;
}
</style>
