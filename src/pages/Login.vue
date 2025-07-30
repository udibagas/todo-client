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
import { client } from "@/lib/client";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const form = reactive({
  email: "",
  password: "",
});

const error = ref<string>("");

const router = useRouter(); // Assuming you have a router instance available

const submitForm = async () => {
  try {
    const { data } = await client.post("/api/login", form);

    console.log("Login successful:", data);

    // localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Handle successful login, e.g., redirect to todos page
    router.push("/"); // Assuming you have a router instance available
  } catch (err: any) {
    error.value =
      err.response.data.message || "Login failed. Please try again.";
    // Handle login error, e.g., show an error message
  }
};
</script>

<template>
  <Card class="mx-auto max-w-sm w-[400px]">
    <CardHeader>
      <CardTitle class="text-2xl"> Login </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="mb-4 text-red-500 text-sm bg-red-50 p-4 rounded-lg"
        v-if="error"
      >
        {{ error }}
      </div>

      <form @submit.prevent="submitForm" class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            v-model="form.email"
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            v-model="form.password"
          />
        </div>
        <Button type="submit" class="w-full"> Login </Button>
      </form>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <router-link to="/register" class="underline"> Sign up </router-link>
      </div>
    </CardContent>
  </Card>
</template>
