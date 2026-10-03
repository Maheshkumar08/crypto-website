<script setup>
import { footer } from "../../data/content";
import { useSiteNav } from "../../composables/useSiteNav";
import logo from "../../assets/logoj1.png";

const { goTo } = useSiteNav();
</script>

<template>
  <footer
    class="relative border-t border-slate-200 bg-slate-50 px-6 pb-10 pt-20 lg:px-10"
  >
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-2 gap-10 pb-16 md:grid-cols-6">
        <div class="col-span-2">
          <img :src="logo" alt="Logo" class="h-36 w-auto object-contain" />

          <p class="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
            {{ footer.tagline }}
          </p>
        </div>

        <div v-for="col in footer.columns" :key="col.title">
          <h4 class="text-sm font-semibold text-blue-600">
            {{ col.title }}
          </h4>

          <ul class="mt-4 space-y-3">
            <li v-for="link in col.links" :key="link.label">
              <button
                type="button"
                data-cursor-hover
                class="text-sm font-bold text-gray-500 transition-colors hover:text-black text-left"
                @click="goTo(link.href)"
              >
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-slate-200 pt-8 text-center text-xs text-gray-400"
      >
        <p>{{ footer.legal }}</p>
      </div>
    </div>
  </footer>
</template>
