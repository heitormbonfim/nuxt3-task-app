<script setup lang="ts">
const { data, error, status } = await useFetch("/api/tasks", { lazy: true });
</script>

<template>
  <div>
    <article v-if="status === 'pending'" aria-busy="true" />
    <article v-else-if="error" class="error">{{ error.statusMessage }}</article>
    <article v-for="task in data" v-else :key="task.id">
      {{ task.title }}
    </article>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
