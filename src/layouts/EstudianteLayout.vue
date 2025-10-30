<template>
  <div class="estudiante-layout">
    <header class="estudiante-header">
      <h1>Panel Estudiante</h1>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.estudiante-header {
  background-color: #15803d;
  color: white;
  padding: 1rem;
}
</style>
