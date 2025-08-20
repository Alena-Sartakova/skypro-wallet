<template>
  <RouterView />
</template>

<script setup>
import { watchEffect } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

watchEffect(async () => {
  if (!authStore.state.value.user) {
    console.log('Пользователь не авторизован, перенаправление...');
    await router.replace('/signin');
  }
});
</script>


<style scoped></style>
