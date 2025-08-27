<script lang="ts" setup>
const { data: tasks, error, status } = await useFetch("/api/tasks", {
	lazy: true,
});
</script>

<template>
	<div>
		<article
			v-if="status === 'pending'"
			aria-busy="true"
		/>
		<article
			v-else-if="error"
			class="error"
		>
			{{ error.statusMessage }}
		</article>
		<div v-else>
			<article
				v-for="task in tasks"
				:key="task.id"
				class="justify-between"
			>
				<h2 :class="{ done: task.done }">
					{{ task.title }}
				</h2>
				<div>
					<NuxtLink
						role="button"
						:to="{ name: 'tasks-id', params: { id: task.id } }"
					>View</NuxtLink>
				</div>
			</article>
		</div>
	</div>
</template>

<style scoped>
.justify-between {
	display: flex;
	justify-items: center;
	justify-content: space-between;
	gap: 2;
}

h2.done {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>
