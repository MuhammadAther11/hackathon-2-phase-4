"use client";

import { useState } from "react";
import { FrontendTask } from "@/types";
import { CheckCircle2, Circle, Trash2, Clock, Edit2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface TaskItemProps {
  task: FrontendTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description?: string) => void;
  isUpdating?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate, isUpdating = false }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, editTitle.trim(), editDescription.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="glass-card rounded-2xl p-5 space-y-3 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-gray-100 text-sm transition-all duration-300"
          placeholder="Task title"
          disabled={isUpdating}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-gray-100 text-sm resize-none transition-all duration-300"
          placeholder="Description (optional)"
          rows={2}
          disabled={isUpdating}
        />
        <div className="flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            disabled={isUpdating}
            className="px-3.5 py-2 text-gray-600 dark:text-gray-400 bg-gray-100/70 dark:bg-white/5 rounded-lg hover:bg-gray-200/70 dark:hover:bg-white/10 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <X className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isUpdating || !editTitle.trim()}
            className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg disabled:opacity-50 transition-all duration-200 flex items-center gap-1.5 text-sm font-display font-medium shadow-md shadow-indigo-500/20"
          >
            <Save className="h-4 w-4" />
            Save
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 group hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(task.id)}
            className="focus:outline-none flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors" />
            )}
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className={`text-[15px] font-medium truncate transition-colors duration-300 ${
              task.completed
                ? "text-gray-400 dark:text-gray-500 line-through"
                : "text-gray-900 dark:text-gray-100"
            }`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`text-xs truncate mt-0.5 ${
                task.completed
                  ? "text-gray-400 dark:text-gray-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
