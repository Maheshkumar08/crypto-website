<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gsap, ScrollTrigger } from "../../composables/gsapSetup";
import { useLenis } from "../../composables/useLenis";
import { useSiteNav } from "../../composables/useSiteNav";
import { nav } from "../../data/content";
import MagneticButton from "../ui/MagneticButton.vue";
import logo from "../../assets/logo2.png";

const headerEl = ref(null);
const menuOpen = ref(false);
const menuPanel = ref(null);
const scrolled = ref(false);
const { scrollTo } = useLenis();
const route = useRoute();
const router = useRouter();
const { goTo: navigateTo } = useSiteNav();

let st;

onMounted(() => {
  st = ScrollTrigger.create({
    start: 40,
    onUpdate: (self) => {
      scrolled.value = self.scroll() > 40;
    },
  });
});

onBeforeUnmount(() => st?.kill());

function goTo(href) {
  menuOpen.value = false;
  navigateTo(href);
}

function goHome() {
  menuOpen.value = false;
  if (route.path === "/") {
    scrollTo(0);
  } else {
    router.push("/");
  }
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<template>
  <header
    ref="headerEl"
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-[#0E407F] border-b border-black ' : 'bg-[#0E407F]'"
  >
    <div class="w-full px-3 sm:px-5 lg:px-8 xl:px-10 py-3">
      <nav
        class="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 sm:gap-x-5 lg:gap-x-8"
      >
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          data-cursor-hover
          class="text-xs sm:text-sm lg:text-base font-medium text-white transition hover:text-gray-900 whitespace-nowrap"
          @click.prevent="goTo(item.href)"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
