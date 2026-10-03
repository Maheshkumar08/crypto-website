<template>
  <div
    class="grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white md:grid-cols-2"
    role="presentation"
    aria-hidden="true"
  >
    <div class="relative aspect-[16/11] overflow-hidden bg-slate-100 md:aspect-auto">
      <div class="skeleton-shimmer h-full w-full" />
    </div>

    <div class="flex flex-col justify-center p-8 lg:p-10">
      <div class="flex flex-wrap items-center gap-2">
        <div class="skeleton-shimmer h-6 w-24 rounded-full" />
        <div class="skeleton-shimmer h-5 w-16 rounded-full" />
        <div class="skeleton-shimmer h-3 w-20 rounded-full" />
      </div>

      <div class="skeleton-shimmer mt-5 h-7 w-11/12 rounded-full" />
      <div class="skeleton-shimmer mt-3 h-7 w-3/4 rounded-full" />

      <div class="mt-4 space-y-2">
        <div class="skeleton-shimmer h-4 w-full rounded-full" />
        <div class="skeleton-shimmer h-4 w-full rounded-full" />
        <div class="skeleton-shimmer h-4 w-2/3 rounded-full" />
      </div>

      <div class="mt-7 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="skeleton-shimmer h-9 w-9 rounded-full" />
          <div class="space-y-1.5">
            <div class="skeleton-shimmer h-3.5 w-28 rounded-full" />
            <div class="skeleton-shimmer h-3 w-20 rounded-full" />
          </div>
        </div>
        <div class="skeleton-shimmer h-4 w-28 rounded-full" />
      </div>
    </div>
  </div>
</template>
