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

import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const router = useRouter(); // Assuming you have a router instance available

const submitForm = () => {
  axios
    .post("http://localhost:8000/api/register", form)
    .then((response) => {
      console.log("Registration successful:", response.data);
      // Handle successful registration, e.g., redirect to login page
      router.push("/login"); // Assuming you have a router instance available
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      // Handle registration error, e.g., show an error message
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
      <form @submit.prevent="submitForm" class="grid gap-4">
        <div class="grid gap-2">
          <Label for="first-name">Name</Label>
          <Input
            id="first-name"
            placeholder="Max"
            required
            v-model="form.name"
          />
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            v-model="form.email"
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            v-model="form.password"
          />
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
