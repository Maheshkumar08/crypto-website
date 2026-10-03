<template>
  <div
    class="grid md:grid-cols-[180px_1fr] gap-6 bg-white border border-sky-100 rounded-2xl p-6 shadow-sm"
    role="presentation"
    aria-hidden="true"
  >
    <div class="flex md:flex-col gap-3 md:gap-2">
      <div class="skeleton-shimmer h-3 w-24 rounded-full" />
      <div class="skeleton-shimmer h-3 w-8 rounded-full" />
    </div>
    <div class="space-y-3">
      <div class="skeleton-shimmer h-5 w-2/3 rounded-full" />
      <div class="skeleton-shimmer h-3.5 w-full rounded-full" />
      <div class="skeleton-shimmer h-3.5 w-4/5 rounded-full" />
    </div>
  </div>
</template>
