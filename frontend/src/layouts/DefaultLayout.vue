<script setup>
import SiteHeader from "../components/layout/SiteHeader.vue";
import HomeHeader from "../components/sections/HomeHeader.vue";
import SiteFooter from "../components/layout/SiteFooter.vue";
</script>

<template>
  <SiteHeader />

  <main class="relative pt-12">
    <HomeHeader />
    <slot />
  </main>

  <SiteFooter />
</template>
