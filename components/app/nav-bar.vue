<template>
  <nav class="container">
    <ul>
      <li>
        <NuxtLink to="/">
          <strong>Task App</strong>
        </NuxtLink>
      </li>
    </ul>
    <ul>
      <li>
        <NuxtLink :to="{ name: 'create' }">Create</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
