<script setup></script>

<template>
  <div class="mx-auto max-w-3xl rounded-2xl border border-dashed border-slate-200 px-8 py-12 text-center">
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-gray-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5">
        <path d="M4 5h16v11H9l-5 4V5Z" />
        <path d="M8 9h8M8 12.5h5" />
      </svg>
    </div>
    <h3 class="mt-4 text-base font-semibold text-gray-900">Discussion is coming soon</h3>
    <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500">
      We're building a proper place for questions and comments on each post. In the meantime,
      <router-link :to="{ name: 'contact' }" class="font-medium text-blue-600 hover:text-blue-700">reach out directly</router-link>.
    </p>
  </div>
</template>
