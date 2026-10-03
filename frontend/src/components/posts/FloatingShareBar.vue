<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ShareButtons from './ShareButtons.vue'

const props = defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true },
})

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 500
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-x-3"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 -translate-x-3"
  >
    <div
      v-if="visible"
      class="glass-strong fixed left-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 rounded-2xl p-3 shadow-lift xl:flex"
    >
      <ShareButtons :title="title" :url="url" vertical />
    </div>
  </Transition>
</template>
