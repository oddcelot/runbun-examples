<script setup lang="ts">
import { useTodos } from "./stores/todos";
import TodoForm from "./components/TodoForm.vue";
import TodoItem from "./components/TodoItem.vue";

const todos = useTodos();
</script>

<template>
  <main>
    <h1>Todos</h1>
    <TodoForm @add="todos.add" />
    <ul>
      <TodoItem
        v-for="todo in todos.visible"
        :key="todo.id"
        :todo="todo"
        @remove="todos.remove(todo.id)"
      />
    </ul>
    <footer>
      <span>{{ todos.remaining }} left</span>
      <label v-for="f in ['all', 'open', 'done'] as const" :key="f">
        <input v-model="todos.filter" type="radio" :value="f" /> {{ f }}
      </label>
    </footer>
  </main>
</template>

<style>
body {
  font-family: system-ui, sans-serif;
}
main {
  max-width: 28rem;
  margin: 2rem auto;
}
ul {
  padding: 0;
  list-style: none;
}
footer {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
