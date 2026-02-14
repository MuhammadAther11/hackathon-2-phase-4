"use client";
import { AuthForm } from "@/components/AuthForm";
import { Suspense } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row relative overflow-hidden auth-gradient-mesh noise-overlay transition-colors">
      {/* Left branding panel - hidden on mobile, visible on md+ */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 border-2 border-white/20 rounded-2xl animate-float rotate-12" />
          <div className="absolute top-[60%] left-[15%] w-14 md:w-16 lg:w-20 h-14 md:h-16 lg:h-20 border-2 border-white/15 rounded-full animate-float-delayed" />
          <div className="absolute top-[20%] right-[15%] w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 border-2 border-white/10 rounded-xl animate-float-slow rotate-45" />
          <div className="absolute bottom-[20%] right-[20%] w-12 md:w-14 lg:w-16 h-12 md:h-14 lg:h-16 bg-white/10 rounded-lg animate-float rotate-12" />
          <div className="absolute top-[45%] left-[45%] w-28 md:w-32 lg:w-40 h-28 md:h-32 lg:h-40 border border-white/10 rounded-full animate-rotate-slow" />
          <div className="absolute bottom-[10%] left-[30%] w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28 bg-white/5 animate-morph" />
        </div>

        {/* Branding content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 px-6 md:px-8 lg:px-12 max-w-lg"
        >
          <div className="flex items-center gap-2.5 md:gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white/90 font-display text-lg md:text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4 md:mb-6">
            Manage your tasks with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
              AI power
            </span>
          </h2>

          <p className="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-10">
            Talk naturally, get things done. Our AI chatbot understands what you need and makes task management effortless.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {["Natural Language", "Smart Scheduling", "AI Powered"].map((feature, i) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs md:text-sm font-medium border border-white/10"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 relative z-10">
        {/* Mobile branding - visible on small screens only */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:hidden mb-6 sm:mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </div>
        </motion.div>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Sign in to continue managing your tasks
            </p>
          </motion.div>

          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            </div>
          }>
            <AuthForm type="login" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
