<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h2>Admin Panel</h2>
      <!-- Menú lateral -->
    </aside>

    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}
.admin-sidebar {
  width: 220px;
  background: #111827;
  color: white;
  padding: 1rem;
}
.admin-main {
  flex: 1;
  background: #f3f4f6;
  padding: 1rem;
}
</style>
