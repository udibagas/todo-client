<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { client } from "@/lib/client";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const errors = ref<Record<string, string[]>>({});
const errorMessage = ref<string>("");

const router = useRouter(); // Assuming you have a router instance available

const submitForm = () => {
  client
    .post("/api/register", form)
    .then((response) => {
      console.log("Registration successful:", response.data);
      // Handle successful registration, e.g., redirect to login page
      router.push("/login"); // Assuming you have a router instance available
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      // Handle registration error, e.g., show an error message
      if (error.response.status == 422) {
        // Validation error
        errors.value = error.response.data.errors;
        errorMessage.value = error.response.data.message;
      }
    });
};
</script>

<template>
  <Card class="mx-auto max-w-sm w-[500px]">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="mb-4 text-red-500 text-sm bg-red-50 p-4 rounded-lg"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </div>
      <form @submit.prevent="submitForm" class="grid gap-4">
        <div class="grid gap-2">
          <Label for="first-name">Name</Label>
          <Input
            id="first-name"
            placeholder="Max"
            required
            v-model="form.name"
            :class="{ 'border-red-500': errors.name }"
          />
          <div class="text-sm text-red-500">
            {{ errors.name ? errors.name[0] : "" }}
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            v-model="form.email"
            :class="{ 'border-red-500': errors.email }"
          />
          <div class="text-sm text-red-500">
            {{ errors.email ? errors.email[0] : "" }}
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            v-model="form.password"
            :class="{ 'border-red-500': errors.password }"
          />
          <div class="text-sm text-red-500">
            {{ errors.password ? errors.password[0] : "" }}
          </div>
        </div>

        <Button type="submit" class="w-full"> Create an account </Button>
      </form>

      <div class="mt-4 text-center text-sm">
        Already have an account?
        <router-link to="/login" class="underline"> Sign in </router-link>
      </div>
    </CardContent>
  </Card>
</template>
