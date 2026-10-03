<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const links = [
  { to: { name: "admin-dashboard" }, label: "Dashboard", icon: "grid" },
  { to: { name: "admin-pages" }, label: "Pages", icon: "pages" },
  { to: { name: "admin-blogs" }, label: "Blogs", icon: "book" },
  { to: { name: "admin-articles" }, label: "Articles", icon: "file" },
  { to: { name: "admin-guides" }, label: "Guide Cards", icon: "cards" },
];

function isActive(to) {
  return (
    route.name === to.name || route.matched.some((r) => r.name === to.name)
  );
}

async function onLogout() {
  await auth.logout();
  router.push({ name: "admin-login" });
}
</script>

<template>
  <aside
    class="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white"
  >
    <div class="flex h-20 items-center px-6">
      <router-link
        :to="{ name: 'home' }"
        class="font-display text-lg font-semibold tracking-tight text-gray-900"
      >
        cryptolearner.us
      </router-link>
    </div>

    <nav class="flex-1 space-y-1 px-4">
      <router-link
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          isActive(link.to)
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900'
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          class="h-5 w-5"
        >
          <rect
            v-if="link.icon === 'grid'"
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            v-if="link.icon === 'grid'"
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            v-if="link.icon === 'grid'"
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1.5"
          />
          <rect
            v-if="link.icon === 'grid'"
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1.5"
          />
          <path
            v-if="link.icon === 'book'"
            d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
          />
          <path
            v-if="link.icon === 'book'"
            d="M20 5.5C20 4.67 19.33 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
          />
          <rect
            v-if="link.icon === 'pages'"
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          />
          <path v-if="link.icon === 'pages'" d="M3 9h18M9 21V9" />
          <path
            v-if="link.icon === 'file'"
            d="M6 3.5h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
          />
          <path v-if="link.icon === 'file'" d="M8 12h8M8 16h8M8 8h4" />
          <rect
            v-if="link.icon === 'cards'"
            x="3.5"
            y="4.5"
            width="13"
            height="9"
            rx="1.8"
            transform="rotate(-8 10 9)"
          />
          <rect
            v-if="link.icon === 'cards'"
            x="5.5"
            y="10.5"
            width="15"
            height="9"
            rx="1.8"
          />
        </svg>
        {{ link.label }}
      </router-link>
    </nav>

    <div class="border-t border-slate-100 p-4">
      <router-link
        :to="{ name: 'home' }"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-slate-50 hover:text-gray-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          class="h-5 w-5"
        >
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
        </svg>
        View site
      </router-link>

      <div
        class="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
      >
        <span class="truncate text-xs text-gray-500">{{
          auth.user?.email
        }}</span>
        <button
          class="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
          @click="onLogout"
        >
          Log out
        </button>
      </div>
    </div>
  </aside>
</template>
