import React, { useState, ChangeEvent } from "react";
import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Input } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface TodoProps {
  todo: {
    _id: string;
    todo: string;
  };
  onDelete: (id: string) => Promise<void>;
  onUpdate: (updatedTodo: { _id: string; todo: string }) => Promise<void>;
}

const Todo: React.FC<TodoProps> = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<string>(todo.todo);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = async () => {
    const updatedTodo = { ...todo, todo: editedTodo };
    try {
      await onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTodo(event.target.value);
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo._id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <VStack
      divider={<StackDivider />}
      borderColor="pink.500"
      borderWidth="2px"
      p="4"
      borderRadius="lg"
      width="100%"
      height="60px"
      marginTop="20px"
      maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
      alignItems="stretch"
    >
      <HStack>
        {isEditing ? (
          <Input
            value={editedTodo}
            onChange={handleInputChange}
            autoFocus
            size="auto"
          />
        ) : (
          <Text>{todo.todo}</Text>
        )}
        <Spacer />
        {isEditing ? (
          <IconButton
            icon={<MdEdit />}
            isRound
            colorScheme="teal"
            onClick={saveEdit}
            aria-label="Save edit"
          />
        ) : (
          <IconButton
            icon={<MdEdit />}
            isRound
            colorScheme="teal"
            onClick={handleEdit}
            aria-label="Edit todo"
          />
        )}
        <IconButton
          icon={<FaTrash />}
          isRound
          colorScheme="red"
          onClick={handleDelete}
          aria-label="Delete todo"
        />
      </HStack>
    </VStack>
  );
};

export default Todo;
