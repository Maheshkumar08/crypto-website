<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const open = ref(false);

const widget = ref(null);
const panel = ref(null);

const toggle = () => {
  open.value = !open.value;
};

const handleClickOutside = (e) => {
  if (widget.value?.contains(e.target)) return;
  if (panel.value?.contains(e.target)) return;

  open.value = false;
};

const handleEsc = (e) => {
  if (e.key === "Escape") {
    open.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("keydown", handleEsc);
});
</script>

<template>
  <!-- Floating Button -->
  <div ref="widget" class="fixed bottom-6 right-6 z-[999999]">
    <button
      type="button"
      @click.stop="toggle"
      class="group flex items-center gap-3 rounded-full bg-[#0f2d2d] px-6 py-4 text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
    >
      <span class="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>

      <span class="font-semibold">
        {{ open ? "Close" : "Talk to us" }}
      </span>
    </button>
  </div>

  <!-- Popup -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-6 scale-95"
    >
      <div
        v-if="open"
        ref="panel"
        class="fixed bottom-24 right-4 left-4 z-[999999] w-auto max-w-[380px] sm:left-auto sm:right-6 sm:w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,.22)]"
      >
        <div class="p-6">
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600"
          >
            GET IN TOUCH
          </p>

          <h3 class="mt-2 text-2xl font-bold text-slate-900">
            Talk to CryptoLearner
          </h3>

          <p class="mt-3 text-sm leading-6 text-slate-500">
            Questions, corrections or feedback? We usually reply within one
            business day.
          </p>
        </div>

        <a
          href="tel:+18005551234"
          class="flex items-center gap-4 border-t p-5 transition hover:bg-slate-50"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl"
          >
            📞
          </div>

          <div>
            <h4 class="font-semibold">Call Us</h4>
            <p class="text-sm text-slate-500">+1 (213) 538-2554</p>
          </div>
        </a>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          class="flex items-center gap-4 border-t p-5 transition hover:bg-slate-50"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl"
          >
            💬
          </div>

          <div>
            <h4 class="font-semibold">WhatsApp</h4>
            <p class="text-sm text-slate-500">Usually replies within an hour</p>
          </div>
        </a>

        <a
          href="mailto:support@cryptolearner.us"
          class="flex items-center gap-4 border-t p-5 transition hover:bg-slate-50"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl"
          >
            ✉️
          </div>

          <div>
            <h4 class="font-semibold">Email Us</h4>
            <p class="text-sm text-slate-500">support@cryptolearner.us</p>
          </div>
        </a>

        <div class="border-t bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          We never ask for wallet keys, passwords or payments over chat.
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
