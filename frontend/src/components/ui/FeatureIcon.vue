<script setup>
defineProps({
  name: { type: String, required: true },
});
</script>

<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.3"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-6 w-6"
  >
    <template v-if="name === 'book'">
      <path
        d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
      />
      <path
        d="M20 5.5C20 4.67 19.33 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
      />
    </template>
    <template v-else-if="name === 'wallet'">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18" />
      <circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3.5 5 6v5.2c0 4.4 3 8 7 9.3 4-1.3 7-4.9 7-9.3V6l-7-2.5Z" />
      <path d="M9.2 12.2l1.9 1.9 3.7-3.9" />
    </template>
    <template v-else-if="name === 'pulse'">
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </template>
    <template v-else-if="name === 'map'">
      <path d="M9 4 4 6.5v13L9 17l6 2.5 5-2.5v-13L15 6.5 9 4Z" />
      <path d="M9 4v13" />
      <path d="M15 6.5v13" />
    </template>
    <template v-else-if="name === 'chat'">
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12.5h5" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </template>
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </template>
    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M4 19c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M15 19c0-2 1.5-3.5 4-3.5" />
    </template>
    <template v-else-if="name === 'cpu'">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
      <path d="M1 9h4M1 15h4M19 9h4M19 15h4" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </template>
    <template v-else-if="name === 'link'">
      <path d="M10 14 8 16a3 3 0 1 1-4-4l3-3a3 3 0 0 1 4 0" />
      <path d="M14 10l2-2a3 3 0 1 1 4 4l-3 3a3 3 0 0 1-4 0" />
      <path d="M9 15l6-6" />
    </template>
  </svg>
</template>
