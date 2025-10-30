<template>
  <div class="empresa-layout">
    <!-- Ejemplo de navbar lateral o superior -->
    <header class="empresa-header">
      <h1>Panel Empresa</h1>
    </header>

    <main class="empresa-content">
      <!-- Aquí se renderizan las vistas hijas -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Si tienes un Navbar o Sidebar personalizado, impórtalo aquí.
// import NavbarEmpresa from '../components/empresa/NavbarEmpresa.vue';
</script>

<style scoped>
.empresa-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.empresa-header {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem;
}

.empresa-content {
  flex: 1;
  padding: 1rem;
  background-color: #f9fafb;
}
</style>
