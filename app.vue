<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

let toggleSidebar = () => {
  open.value = !open.value
}

</script>

<template>
  <div class="max-w-7xl mx-auto">
    <UHeader class="header">
      <template #logo>
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
        <p class="ml-2">Rubie</p>
      </template>
      <template #right>
        <UColorModeButton />
        <!-- <font-awesome-icon :icon="['fas', 'bars']" @click="toggleSidebar" class="cursor-pointer" /> -->
      </template>
    </UHeader>
    <UDashboardSlideover v-model="open" title="Notifications" />
    <NuxtPage />
  </div>
</template>

<style></style>
