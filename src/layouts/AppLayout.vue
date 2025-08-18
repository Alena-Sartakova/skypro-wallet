<template>
  <div class="layout">
    <HeaderComponent />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
