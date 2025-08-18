import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the Task interface for type safety.
import type { Task } from "~/types";

// Define the shape of our store's state and actions.
interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

// Create the Zustand store with persist middleware
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        set((state) => {
          const newTask: Task = {
            ...task,
            id: Date.now().toString(), // Generate a unique ID
            createdAt: new Date(), // Set the creation date
            completed: false, // New tasks start as not completed
          };

          // Add the new task and sort the list by createdAt in descending order.
          const updatedTasks = [newTask, ...state.tasks].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

          return { tasks: updatedTasks };
        });
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
    }),
    {
      name: "task-storage", // A unique name for your localStorage key
      storage: createJSONStorage(() => localStorage), // The storage engine to use
      // We need to handle date serialization manually
      partialize: (state) => ({
        tasks: state.tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
        })),
      }),
      merge: (persistedState: any, currentState) => {
        const tasks = persistedState.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        return {
          ...currentState,
          tasks,
        };
      },
    }
  )
);
