<script lang="ts" setup>
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();

const newTitle = ref("");
const { data: task, error, status } = await useFetch(`/api/tasks/${route.params.id}`, {
	lazy: true,
	onResponse({ response }) {
		if (response._data?.title) newTitle.value = response._data.title;
	},
});

const taskTitle = computed(() => task.value?.title || "Loading...");
useHead({ title: `Task App | ${taskTitle.value}` });

async function updateTaskTitle() {
	if (!task.value) return;
	const trimmedTitle = newTitle.value.trim();
	if (!trimmedTitle) return alert("Title cannot be empty!");
	const { error } = await useFetch(`/api/tasks/${task.value.id}`, {
		method: "PATCH",
		body: { title: trimmedTitle },
	});
	if (error.value) return alert(`Error updating title: ${error.value.statusMessage}`);
	task.value.title = trimmedTitle;
	alert("Task title updated!");
}

async function completeTask() {
	if (!task.value) return;
	const newDone = !task.value.done;
	task.value.done = newDone;
	const { error } = await useFetch(`/api/tasks/${task.value.id}`, {
		method: "PATCH",
		body: { done: newDone },
	});
	if (error.value) {
		task.value.done = !newDone;
		alert(`Error updating task: ${error.value.statusMessage}`);
	}
}

async function deleteTask() {
	if (!task.value) return;
	if (!confirm(`Delete "${task.value.title}"?`)) return;
	const { error } = await useFetch(`/api/tasks/${task.value.id}`, { method: "DELETE" });
	if (error.value) return alert(`Error deleting task: ${error.value.statusMessage}`);
	alert("Task deleted.");
	router.push("/");
}
</script>

<template>
	<main class="task-card">
		<article
			v-if="status === 'pending'"
			aria-busy="true"
		>
			Fetching task...
		</article>

		<article
			v-else-if="error"
			class="error"
		>
			{{ error.statusMessage }}
		</article>

		<article
			v-else-if="task"
			class="task-card"
		>
			<h2 :class="{ done: task.done }">
				{{ task.title }}
			</h2>

			<form
				class="grid"
				@submit.prevent="updateTaskTitle"
			>
				<input
					v-model="newTitle"
					type="text"
					placeholder="Edit title…"
				>
				<button
					type="submit"
					class="primary"
				>
					Save
				</button>
			</form>

			<div class="grid action-buttons">
				<button
					:class="task.done ? 'secondary outline' : 'secondary'"
					@click="completeTask"
				>
					{{ task.done ? 'Mark Incomplete' : 'Mark Complete' }}
				</button>
				<button
					class="contrast"
					@click="deleteTask"
				>
					Delete
				</button>
			</div>
		</article>
	</main>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
}

.task-card {
  padding: 2rem;
  border-radius: var(--pico-border-radius);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background: var(--pico-background-card);
}

h2.done {
  text-decoration: line-through;
  opacity: 0.7;
}

form.grid {
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  margin: 1rem 0;
}

.action-buttons {
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.error {
  color: var(--pico-color-red);
  font-weight: bold;
}
</style>
