"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  CheckCircle2,
  Zap,
  Shield,
  Smartphone,
  MessageCircle,
  ArrowRight,
  Bot,
  Sparkles,
  ListChecks,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export default function HomePage() {
  const { data: session, isLoading } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a1a] auth-gradient-mesh noise-overlay transition-colors relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0a1a]/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-gray-900 dark:text-white tracking-tight">
                TaskFlow
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!isLoading && session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-display font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex text-sm font-display font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-display font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating geometric shapes - hidden on very small screens for performance */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-[8%] w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 border border-indigo-200/30 dark:border-indigo-500/10 rounded-3xl rotate-12 animate-float" />
        <div className="absolute top-[60%] right-[5%] w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 border border-purple-200/30 dark:border-purple-500/10 rounded-full animate-float-delayed" />
        <div className="absolute top-[20%] right-[15%] w-20 sm:w-28 lg:w-32 h-20 sm:h-28 lg:h-32 bg-indigo-100/40 dark:bg-indigo-500/5 rounded-2xl rotate-45 animate-float-slow" />
        <div className="absolute bottom-[15%] left-[12%] w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 border border-pink-200/20 dark:border-pink-500/10 rounded-full animate-morph" />
        <div className="absolute top-[45%] left-[40%] w-32 sm:w-40 lg:w-52 h-32 sm:h-40 lg:h-52 border border-indigo-100/20 dark:border-indigo-500/5 rounded-full animate-rotate-slow" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-20">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Task Management
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-gray-900 dark:text-white">Manage tasks</span>
              <br />
              <span className="text-gray-900 dark:text-white">with the power of </span>
              <span className="gradient-text">conversation</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed"
            >
              Just type what you need. TaskFlow&apos;s AI understands natural language and turns your words into organized, actionable tasks.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {!isLoading && !session && (
                <>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-xl font-display font-semibold shadow-xl shadow-indigo-500/25 dark:shadow-indigo-500/15 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-display font-semibold transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md"
                  >
                    Sign In
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </>
              )}
              {session && (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-xl font-display font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 dark:text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Setup in seconds
              </span>
            </motion.div>
          </div>

          {/* Right: Interactive demo card */}
          <motion.div
            variants={scaleIn}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-glow-pulse" />

              {/* Main card */}
              <div className="relative glass-card rounded-2xl p-1 shadow-2xl shadow-indigo-500/10">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-t-xl px-5 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-white">AI Task Assistant</p>
                    <p className="text-xs text-white/60">Always ready to help</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/50">Online</span>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-5 space-y-4">
                  {/* User message */}
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-md text-sm max-w-[75%] shadow-md shadow-indigo-500/15">
                      Add task: Buy groceries tomorrow
                    </div>
                  </motion.div>

                  {/* Agent response */}
                  <motion.div
                    className="flex gap-2.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="glass-card px-4 py-2.5 rounded-2xl rounded-tl-md text-sm text-gray-700 dark:text-gray-300 max-w-[75%]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Done!</span> Task &quot;Buy groceries&quot; created for tomorrow.
                    </div>
                  </motion.div>

                  {/* Second user message */}
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-md text-sm max-w-[75%] shadow-md shadow-indigo-500/15">
                      Show my tasks
                    </div>
                  </motion.div>

                  {/* Task list response */}
                  <motion.div
                    className="flex gap-2.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0, duration: 0.4 }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                      <p className="font-medium text-gray-900 dark:text-white">Here are your tasks:</p>
                      {["Buy groceries", "Finish project report", "Call dentist"].map((task, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${i === 1 ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'}`} />
                          <span className={i === 1 ? 'line-through text-gray-400 dark:text-gray-500' : ''}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Input bar */}
                <div className="px-5 py-3 border-t border-gray-200/60 dark:border-white/[0.06] flex items-center gap-2.5">
                  <div className="flex-1 bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 dark:text-gray-500">
                    Type a message...
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 mb-4"
          >
            <ListChecks className="h-3.5 w-3.5" />
            Why TaskFlow
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Everything you need to stay{" "}
            <span className="gradient-text">productive</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Simple, powerful, and designed to get out of your way so you can focus on what matters.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          {[
            {
              icon: MessageCircle,
              title: "Natural Language",
              description: "Just type what you want. No buttons, no forms — just conversation.",
              gradient: "from-indigo-500 to-purple-500",
              iconBg: "bg-indigo-100 dark:bg-indigo-500/10",
              iconColor: "text-indigo-600 dark:text-indigo-400",
            },
            {
              icon: Bot,
              title: "AI Powered",
              description: "Smart agent understands context and picks the right action automatically.",
              gradient: "from-emerald-500 to-teal-500",
              iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
              iconColor: "text-emerald-600 dark:text-emerald-400",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Create, update, and complete tasks in seconds. Built for speed.",
              gradient: "from-amber-500 to-orange-500",
              iconBg: "bg-amber-100 dark:bg-amber-500/10",
              iconColor: "text-amber-600 dark:text-amber-400",
            },
            {
              icon: Shield,
              title: "Secure by Default",
              description: "JWT authentication, encrypted data, and private by design.",
              gradient: "from-sky-500 to-blue-500",
              iconBg: "bg-sky-100 dark:bg-sky-500/10",
              iconColor: "text-sky-600 dark:text-sky-400",
            },
            {
              icon: Smartphone,
              title: "Fully Responsive",
              description: "Works flawlessly on desktop, tablet, and mobile devices.",
              gradient: "from-violet-500 to-purple-500",
              iconBg: "bg-violet-100 dark:bg-violet-500/10",
              iconColor: "text-violet-600 dark:text-violet-400",
            },
            {
              icon: ListChecks,
              title: "Real-Time Sync",
              description: "Chat and dashboard stay in sync. Changes appear instantly everywhere.",
              gradient: "from-pink-500 to-rose-500",
              iconBg: "bg-pink-100 dark:bg-pink-500/10",
              iconColor: "text-pink-600 dark:text-pink-400",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 group cursor-default"
            >
              <div className={`w-11 h-11 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
              </div>
              <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              {/* Bottom accent */}
              <div className={`mt-5 h-1 w-10 rounded-full bg-gradient-to-r ${feature.gradient} opacity-50 group-hover:w-full transition-all duration-500`} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-600" />

          {/* Floating shapes inside CTA */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-32 h-32 border border-white/10 rounded-2xl rotate-12 animate-float" />
            <div className="absolute bottom-[10%] right-[8%] w-24 h-24 border border-white/10 rounded-full animate-float-delayed" />
            <div className="absolute top-[50%] right-[30%] w-20 h-20 bg-white/5 rounded-lg rotate-45 animate-float-slow" />
          </div>

          <div className="relative px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-5 tracking-tight">
              Ready to work smarter?
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-8 sm:mb-10 max-w-xl mx-auto">
              Join TaskFlow and start managing your tasks through natural conversation. Free forever, no strings attached.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              {!isLoading && !session ? (
                <>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-display font-semibold text-base shadow-xl shadow-black/10 hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                  >
                    Create Free Account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white rounded-xl font-display font-semibold text-base hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                session && (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-display font-semibold text-base shadow-xl shadow-black/10 hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-gray-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a1a]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-display font-semibold text-gray-600 dark:text-gray-400">TaskFlow</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with AI. Designed for humans.
          </p>
        </div>
      </footer>
    </div>
  );
}
