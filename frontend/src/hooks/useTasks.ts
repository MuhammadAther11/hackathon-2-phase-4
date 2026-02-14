"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { FrontendTask } from "@/types";
import { useToast } from "@/components/ui/toast-provider";
import { formatTaskError } from "@/lib/task-errors";

export function useTasks() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: tasks = [], isLoading, error } = useQuery<FrontendTask[]>({
    queryKey: ["tasks"],
    queryFn: () => apiFetch<FrontendTask[]>("/tasks"),
    retry: 3,
  });

  // Show error toast when tasks query fails (inside useEffect to avoid infinite re-render)
  useEffect(() => {
    if (error) {
      showToast(formatTaskError(error, "load"), "error");
    }
  }, [error]);

  const createTask = useMutation({
    mutationFn: (taskData: { title: string; description?: string }) =>
      apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task created successfully", "success");
    },
    onError: (err: unknown) => {
      showToast(formatTaskError(err, "create"), "error");
    }
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...updates }: Partial<FrontendTask> & { id: string }) =>
      apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task updated successfully", "success");
    },
    onError: (err: unknown) => {
      showToast(formatTaskError(err, "update"), "error");
    }
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/tasks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task deleted successfully", "success");
    },
    onError: (err: unknown) => {
      showToast(formatTaskError(err, "delete"), "error");
    }
  });

  const toggleTask = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/tasks/${id}/complete`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task status updated", "success");
    },
    onError: (err: unknown) => {
      showToast(formatTaskError(err, "toggle"), "error");
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,  // Added toggle function
  };
}
