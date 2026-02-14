"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskItem } from "./TaskItem";
import { Plus, Loader2, ListChecks, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TaskDashboard() {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [formFocused, setFormFocused] = useState(false);
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTask } = useTasks();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask.mutateAsync({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
    });
    setNewTitle("");
    setNewDescription("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
          <Loader2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Create task form */}
      <motion.form
        onSubmit={handleCreate}
        className={`glass-card rounded-2xl p-6 space-y-4 transition-shadow duration-300 ${formFocused ? 'shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/5' : 'shadow-lg shadow-black/5 dark:shadow-black/20'}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-sm font-display font-semibold text-gray-700 dark:text-gray-300">New Task</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-display">
            Title
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-sm transition-opacity duration-300 ${formFocused ? 'group-focus-within:opacity-30' : 'group-hover:opacity-15'}`} />
            <input
              type="text"
              placeholder="What needs to be done?"
              className="relative w-full px-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] transition-all duration-300"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onFocus={() => setFormFocused(true)}
              onBlur={() => setFormFocused(false)}
              disabled={createTask.isPending}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-display">
            Description <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add more details..."
            className="w-full px-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] resize-none transition-all duration-300"
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onFocus={() => setFormFocused(true)}
            onBlur={() => setFormFocused(false)}
            disabled={createTask.isPending}
          />
        </div>

        <motion.button
          type="submit"
          disabled={createTask.isPending || !newTitle.trim()}
          whileHover={!createTask.isPending ? { scale: 1.01 } : undefined}
          whileTap={!createTask.isPending ? { scale: 0.98 } : undefined}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 font-display font-semibold shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/15 hover:shadow-xl hover:shadow-indigo-500/30"
        >
          {createTask.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Add Task</span>
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <TaskItem
                  task={task}
                  onToggle={(id) => toggleTask.mutate(id)}
                  onDelete={(id) => deleteTask.mutate(id)}
                  onUpdate={(id, title, description) => updateTask.mutate({ id, title, description })}
                  isUpdating={updateTask.isPending}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card rounded-2xl border-2 border-dashed border-gray-200/60 dark:border-white/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ListChecks className="h-7 w-7 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100">No tasks yet</h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Create your first task above to get started on your productivity journey.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
