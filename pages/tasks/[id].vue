<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

const {
  data: task,
  error,
  status,
  refresh,
} = await useFetch(`/api/tasks/${route.params.id}`, {
  lazy: true,
});

const taskTitle = computed(() => task.value?.title || "Loading...");

useHead({
  title: `Task App | ${taskTitle.value}`,
});

async function completeTask() {
  if (!task.value) return;

  const isDone = !task.value.done;

  task.value.done = isDone;

  const { error } = await useFetch(`/api/tasks/${task.value.id}`, {
    method: "PATCH",
    body: { done: isDone },
  });

  if (error.value) {
    task.value.done = !isDone;
    alert(`Error updating task: ${error.value.statusMessage}`);
    return;
  }
}

async function deleteTask() {
  if (!task.value) return;

  if (
    !confirm(`Are you sure you want to delete the task "${task.value.title}"?`)
  ) {
    return;
  }

  const { error } = await useFetch(`/api/tasks/${task.value.id}`, {
    method: "DELETE",
  });

  if (error.value) {
    alert(`Error deleting task: ${error.value.statusMessage}`);
    return;
  }

  alert("Task deleted successfully!");
  await router.push("/");
}
</script>

<template>
  <div>
    <article v-if="status === 'pending'" aria-busy="true" />
    <article v-else-if="error" class="error">
      {{ error.statusMessage }}
    </article>
    <div v-else-if="task">
      <article :class="task.done ? 'text-cutted' : null">
        {{ task.title }}
      </article>
    </div>
    <div class="buttons-container">
      <button @click="complateTask()" class="bg-green">Complete</button>
      <button @click="deleteTask()" style="background-color: red">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.buttons-container {
  display: flex;
  justify-items: center;
  justify-content: space-between;
  gap: 4px;
}

.bg-green {
  background-color: #00895a;
}

.bg-red {
  background-color: #d11a2a;
}

.text-cutted {
  text-decoration: line-through;
}
</style>
