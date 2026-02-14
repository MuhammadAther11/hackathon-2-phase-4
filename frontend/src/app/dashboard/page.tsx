"use client";
import { TaskDashboard } from "@/components/TaskDashboard";
import { NavBar } from "@/components/NavBar";
import { useTasks } from "@/hooks/useTasks";
import { motion } from "framer-motion";
import { ListChecks, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const statsContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const statsItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function DashboardPage() {
  const { tasks } = useTasks();

  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter((t) => t.completed).length ?? 0;
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListChecks,
      color: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-100 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-100 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a1a] auth-gradient-mesh noise-overlay transition-colors">
      <NavBar />
      <main className="py-8 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Track your progress and stay productive.
                </p>
              </div>
              {/* Completion progress bar */}
              {totalTasks > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-xl"
                >
                  <div className="w-32 h-2 bg-gray-200/60 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-display font-semibold text-gray-700 dark:text-gray-300">
                    {completionRate}%
                  </span>
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* Stats grid */}
          <motion.div
            variants={statsContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={statsItem}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 group cursor-default"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                    {stat.label}
                  </p>
                  {/* Bottom accent bar */}
                  <div className={`mt-3 sm:mt-4 h-1 w-10 sm:w-12 rounded-full bg-gradient-to-r ${stat.color} opacity-60 group-hover:w-full transition-all duration-500`} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Task list section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <TaskDashboard />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
