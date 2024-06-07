import { VStack, IconButton, useColorMode } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { HStack, Button, Input } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Todo from "./Todo";

interface Todo {
  _id: string;
  todo: string;
}

export default function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch(`${backendUrl}/api/todos/`);
        const todos: Todo[] = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    getTodos();
  }, [backendUrl]);

  const createNewTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch(`${backendUrl}/api/todos`, {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newTodo: Todo = await res.json();
        setContent("");
        setTodos([...todos, newTodo]);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await fetch(`${backendUrl}/api/todos/${todoId}`, {
        method: "DELETE",
      });
      setTodos(todos.filter(todo => todo._id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (updatedTodo: Todo) => {
    try {
      await fetch(`${backendUrl}/api/todos/${updatedTodo._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack p={8}>
      <IconButton
        icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
        isRound
        size="lg"
        alignSelf="flex-end"
        onClick={toggleColorMode}
        aria-label="toggleColorMode"
      />
      <main>
        <Heading mb="4" fontWeight="extrabold" size="3xl" bgGradient="linear(to-r, blue.300, orange.400, purple.200)" bgClip="text">
          Todo Application
        </Heading>
        <form onSubmit={createNewTodo}>
          <HStack mt="8">
            <Input
              variant="filled"
              placeholder="Enter todos..."
              size="auto"
              value={content}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
            />
            <Button colorScheme="blue" px="8" type="submit">
              Add Todo
            </Button>
          </HStack>
        </form>
        <div>
          {todos.map((todo) => (
            <Todo key={todo._id} todo={todo} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      </main>
    </VStack>
  );
}
