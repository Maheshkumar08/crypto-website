<template>
  <nav
    aria-hidden="true"
    role="presentation"
    class="rounded-[28px] border border-[#E8EEF5] bg-white/70 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:sticky lg:top-24"
  >
    <ul class="flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible">
      <li v-for="i in 5" :key="i" class="shrink-0 lg:shrink">
        <div class="flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-3.5 py-2.5">
          <div class="skeleton-shimmer h-8 w-8 shrink-0 rounded-xl" />
          <div class="skeleton-shimmer h-3.5 w-20 rounded-full lg:w-28" />
          <div class="skeleton-shimmer ml-auto h-5 w-7 shrink-0 rounded-full" />
        </div>
      </li>
    </ul>
  </nav>
</template>
