<template>
  <nav aria-hidden="true" role="presentation" class="lg:sticky lg:top-24 lg:border-r lg:border-[#E8EEF5] lg:pr-6">
    <ul class="flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible">
      <li v-for="i in 5" :key="i" class="shrink-0 lg:shrink">
        <div class="flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5">
          <div class="skeleton-shimmer h-3.5 w-24 rounded-full lg:w-28" />
          <div class="skeleton-shimmer ml-auto h-5 w-7 shrink-0 rounded-full" />
        </div>
      </li>
    </ul>
  </nav>
</template>
