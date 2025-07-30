<script setup lang="ts">
import { client } from "./lib/client";

client
  .get("/sanctum/csrf-cookie")
  .then(() => {
    console.log("CSRF cookie set successfully");
  })
  .catch((error) => {
    console.error("Failed to set CSRF cookie:", error);
  });
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <router-view />
  </div>
</template>
