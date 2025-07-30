<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Trash2, Plus, Edit, Save, X } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { client } from "@/lib/client"; // Assuming you have a client setup for axios

interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string;
  due_date: Date | null;
  completed: boolean;
  priority: string;
  created_at: Date;
  updated_at: Date;
}

const router = useRouter();

// State
const todos = ref<Todo[]>([]);
const newTodoText = ref("");
const editingId = ref<number | null>(null);
const editingText = ref("");
const user = ref<{ name: string }>({
  name: JSON.parse(localStorage.getItem("user") || "{}")?.name || "Guest",
});

// Computed
const completedTodos = computed(() =>
  todos.value.filter((todo) => todo.completed)
);

const pendingTodos = computed(() =>
  todos.value.filter((todo) => !todo.completed)
);

const completionRate = computed(() => {
  if (todos.value.length === 0) return 0;
  return Math.round((completedTodos.value.length / todos.value.length) * 100);
});

// Methods
const addTodo = () => {};

const toggleTodo = (id: number) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = async (id: number) => {
  try {
    await client.delete("/api/todo/" + id);
    fetchTodo();
  } catch (err) {
    console.error(err);
  }
};

const startEdit = (todo: Todo) => {
  console.log("Editing todo:", todo);
  // editingId.value = todo.id;
};

const saveEdit = () => {
  //
};

const cancelEdit = () => {
  editingId.value = null;
  editingText.value = "";
};

const handleKeydown = (event: KeyboardEvent, action: "add" | "edit") => {
  console.log("Key pressed:", action, event.key);
  // if (event.key === "Enter") {
  //   if (action === "add") {
  //     addTodo();
  //   } else if (action === "edit") {
  //     saveEdit();
  //   }
  // } else if (event.key === "Escape" && action === "edit") {
  //   cancelEdit();
  // }
};

const logout = () => {
  client
    .post("/api/logout")
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    })
    .catch((err) => {
      console.error(err);
    });
};

const fetchTodo = () => {
  client
    .get("/api/todo")
    .then((response) => {
      todos.value = response.data.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(() => {
  fetchTodo();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Header -->
    <div class="mb-8 flex justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Todo List
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Stay organized and get things done
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div class="font-bold">Welcome, {{ user.name }}</div>
        |
        <a href="#" @click.prevent="logout">Logout</a>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ todos.length }}
            </p>
          </div>
          <div
            class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
          >
            <span
              class="text-blue-600 dark:text-blue-400 text-sm font-semibold"
              >{{ todos.length }}</span
            >
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ completedTodos.length }}
            </p>
          </div>
          <div
            class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
          >
            <Check class="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress
            </p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ completionRate }}%
            </p>
          </div>
          <div
            class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
          >
            <span
              class="text-purple-600 dark:text-purple-400 text-xs font-semibold"
              >{{ completionRate }}%</span
            >
          </div>
        </div>
      </Card>
    </div>

    <!-- Add Todo Form -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Plus class="w-5 h-5" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-2">
          <div class="flex-1">
            <Label for="new-todo" class="sr-only">New todo</Label>
            <Input
              id="new-todo"
              v-model="newTodoText"
              placeholder="Enter a new task..."
              class="w-full"
              @keydown="handleKeydown($event, 'add')"
            />
          </div>
          <Button
            @click="addTodo"
            :disabled="!newTodoText.trim()"
            class="shrink-0"
          >
            <Plus class="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Todo List -->
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="todos.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400 text-lg">No tasks yet</p>
          <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Add your first task above to get started
          </p>
        </div>

        <div v-else class="space-y-2">
          <!-- Pending Todos -->
          <div v-if="pendingTodos.length > 0">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Pending ({{ pendingTodos.length }})
            </h3>
            <div class="space-y-2">
              <div
                v-for="todo in pendingTodos"
                :key="todo.id"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Button
                  variant="outline"
                  size="sm"
                  @click="toggleTodo(todo.id)"
                  class="shrink-0 w-8 h-8 p-0 border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900 hover:border-green-300 dark:hover:border-green-600"
                >
                  <Check class="w-4 h-4 text-gray-400" />
                </Button>

                <div class="flex-1 min-w-0">
                  <div v-if="editingId === todo.id" class="flex gap-2">
                    <Input
                      v-model="editingText"
                      class="flex-1"
                      @keydown="handleKeydown($event, 'edit')"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      @click="saveEdit"
                      class="shrink-0"
                    >
                      <Save class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="cancelEdit"
                      class="shrink-0"
                    >
                      <X class="w-4 h-4" />
                    </Button>
                  </div>
                  <div v-else class="flex items-center justify-between">
                    <span class="text-gray-900 dark:text-gray-100 truncate">{{
                      todo.title
                    }}</span>
                    <div class="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="startEdit(todo)"
                        class="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Edit class="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="deleteTodo(todo.id)"
                        class="w-8 h-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Todos -->
          <div v-if="completedTodos.length > 0" class="mt-6">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Completed ({{ completedTodos.length }})
            </h3>
            <div class="space-y-2">
              <div
                v-for="todo in completedTodos"
                :key="todo.id"
                class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <Button
                  variant="outline"
                  size="sm"
                  @click="toggleTodo(todo.id)"
                  class="shrink-0 w-8 h-8 p-0 bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-700"
                >
                  <Check class="w-4 h-4 text-green-600 dark:text-green-400" />
                </Button>

                <div class="flex-1 min-w-0 flex items-center justify-between">
                  <span
                    class="text-gray-600 dark:text-gray-400 line-through truncate"
                    >{{ todo.title }}</span
                  >
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="deleteTodo(todo.id)"
                    class="w-8 h-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
