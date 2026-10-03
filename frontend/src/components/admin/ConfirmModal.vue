<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Delete' },
  danger: { type: Boolean, default: true },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/40 px-6" @click.self="emit('cancel')">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="open" class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p v-if="message" class="mt-2 text-sm text-gray-500">{{ message }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              class="rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors"
              :class="danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
              @click="emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
