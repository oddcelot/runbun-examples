<script setup lang="ts">
const visits = useState("visits", () => 0);
onMounted(() => visits.value++);

const { todos, add } = useTodos();
const text = ref("");

function submit() {
  if (!text.value.trim()) return;
  add(text.value.trim());
  text.value = "";
}
</script>

<template>
  <main>
    <h1>Todos</h1>
    <form @submit.prevent="submit">
      <input v-model="text" placeholder="What needs doing?" />
      <button>Add</button>
    </form>
    <TodoList :todos="todos" />
  </main>
</template>
