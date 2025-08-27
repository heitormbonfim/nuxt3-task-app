<script lang="ts" setup>
import type { FetchError } from "ofetch";

const errorMessage = ref("");
const loading = ref(false);
const taskName = ref("");

async function onSubmit() {
	if (!taskName.value.trim()) {
		errorMessage.value = "Task is required.";
		return;
	}
	try {
		loading.value = true;
		errorMessage.value = "";
		const result = await $fetch("/api/tasks", {
			method: "POST",
			body: { title: taskName.value },
		});
		navigateTo({ name: "tasks-id", params: { id: result.id } });
	}
	catch (e) {
		const error = e as FetchError;
		errorMessage.value = error.statusMessage || "Unknown error occurred";
	}
	loading.value = false;
}
</script>

<template>
	<main class="container">
		<article
			v-if="loading"
			aria-busy
		>
			Creating task...
		</article>

		<article
			v-else-if="errorMessage"
			class="error"
		>
			{{ errorMessage }}
		</article>

		<form
			class="task-card grid"
			@submit.prevent="onSubmit"
		>
			<header>
				<h1>Create a Task</h1>
			</header>

			<label>
				Task Name
				<input
					v-model="taskName"
					name="title"
					placeholder="Enter your task title"
					required
				>
			</label>

			<button
				type="submit"
				class="primary"
			>
				Create
			</button>
		</form>
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
  background: var(--pico-background-card);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error {
  color: var(--pico-color-red);
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
