<script setup>
import { ref } from 'vue'
import { uploadImage, optimizedUrl } from '../../services/cloudinary'

const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const error = ref('')
const inputEl = ref(null)

async function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    error.value = 'Please choose an image file.'
    return
  }

  error.value = ''
  uploading.value = true
  progress.value = 0

  try {
    const result = await uploadImage(file, { folder: 'lumen-ledger/covers', onProgress: (p) => (progress.value = p) })
    emit('update:modelValue', result.url)
  } catch (err) {
    error.value = err.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

function onDrop(e) {
  dragging.value = false
  handleFile(e.dataTransfer.files[0])
}

function onSelect(e) {
  handleFile(e.target.files[0])
}

function removeImage() {
  emit('update:modelValue', '')
  if (inputEl.value) inputEl.value.value = ''
}
</script>

<template>
  <div>
    <div
      v-if="!modelValue"
      class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"
      :class="dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
      @click="inputEl.click()"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-8 w-8 text-gray-400">
        <path d="M12 16V4M12 4 7 9M12 4l5 5" />
        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      </svg>
      <p class="mt-3 text-sm text-gray-500">
        <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
      </p>
      <p class="mt-1 text-xs text-gray-400">PNG or JPG, up to a few MB</p>
      <input ref="inputEl" type="file" accept="image/*" class="hidden" @change="onSelect" />
    </div>

    <div v-else class="group relative overflow-hidden rounded-xl border border-slate-200">
      <img :src="optimizedUrl(modelValue, { width: 800 })" alt="" class="h-48 w-full object-cover" />
      <button
        type="button"
        class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
        @click="removeImage"
      >
        Remove
      </button>
    </div>

    <div v-if="uploading" class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div class="h-full rounded-full bg-blue-600 transition-all" :style="{ width: progress + '%' }" />
    </div>
    <p v-if="error" class="mt-2 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
