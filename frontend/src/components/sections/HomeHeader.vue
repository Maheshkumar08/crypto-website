<script setup>
import { RouterLink } from "vue-router";
import logo from "../../assets/logoj1.png";
</script>

<template>
  <header class="w-full border-b border-white/40 bg-white/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 py-2">
      <div class="grid grid-cols-[auto_1fr_auto] items-center">
        <!-- Logo -->
        <RouterLink to="/" class="justify-self-start">
          <img :src="logo" alt="cryptolearner.us" class="h-20 sm:h-16 w-auto" />
        </RouterLink>

        <!-- Navigation -->
        <nav class="flex flex-wrap justify-center gap-x-5 gap-y-2 px-4">
          <RouterLink
            to="/getting-started"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Getting Started
          </RouterLink>

          <RouterLink
            to="/safety"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Safety
          </RouterLink>

          <RouterLink
            to="/coins"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Coins
          </RouterLink>

          <RouterLink
            to="/exchanges"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Exchanges
          </RouterLink>

          <RouterLink
            to="/taxes"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Taxes
          </RouterLink>

          <RouterLink
            to="/glossary"
            class="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-900 transition"
          >
            Glossary
          </RouterLink>
        </nav>

        <!-- Empty Right -->
        <div class="w-8"></div>
      </div>
    </div>
  </header>
</template>
