<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(() => {

  authStore.init();
});
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
</style>