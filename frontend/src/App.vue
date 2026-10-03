<script setup>
import { computed, defineAsyncComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLenis } from "./composables/useLenis";
import { installScrollSync } from "./composables/routeScroll";
import { pageKey } from "./router";

import CustomCursor from "./components/layout/CustomCursor.vue";
import DefaultLayout from "./layouts/DefaultLayout.vue";

// 👇 Import Contact Widget
import ContactWidget from "./components/sections/ContactWidget.vue";

const layouts = {
  default: DefaultLayout,
  admin: defineAsyncComponent(() => import("./layouts/AdminLayout.vue")),
  auth: defineAsyncComponent(() => import("./layouts/AuthLayout.vue")),
};

const route = useRoute();

const layout = computed(() => layouts[route.meta.layout || "default"]);

const isMarketingSite = computed(
  () => (route.meta.layout || "default") === "default",
);

const { start } = useLenis();

onMounted(() => {
  start();
  installScrollSync();
});
</script>

<template>
  <template v-if="isMarketingSite">
    <CustomCursor />
    <div class="grain" />
  </template>

  <component :is="layout">
    <RouterView v-slot="{ Component, route: viewRoute }">
      <component :is="Component" :key="pageKey(viewRoute)" />
    </RouterView>
  </component>

  <!-- 👇 Floating Contact Widget on all marketing pages -->
  <ContactWidget v-if="isMarketingSite" />
</template>
