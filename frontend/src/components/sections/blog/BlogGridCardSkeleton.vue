<template>
  <div
    class="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E8EEF5] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]"
    role="presentation"
    aria-hidden="true"
  >
    <div class="aspect-video overflow-hidden rounded-t-[24px] bg-slate-100">
      <div class="skeleton-shimmer h-full w-full" />
    </div>

    <div class="flex flex-1 flex-col p-6">
      <div class="skeleton-shimmer h-5 w-11/12 rounded-full" />
      <div class="skeleton-shimmer mt-2 h-5 w-2/3 rounded-full" />

      <div class="skeleton-shimmer mt-3 h-3.5 w-full rounded-full" />
      <div class="skeleton-shimmer mt-1.5 h-3.5 w-4/5 rounded-full" />

      <div class="skeleton-shimmer mt-4 h-3.5 w-20 rounded-full" />

      <div class="mt-auto flex items-center gap-2 pt-5">
        <div class="skeleton-shimmer h-7 w-7 rounded-full" />
        <div class="skeleton-shimmer h-3.5 w-24 rounded-full" />
      </div>
    </div>
  </div>
</template>
