<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Callout } from '../../composables/tiptapCallout'
import { Gallery } from '../../composables/tiptapGallery'
import { VideoEmbed, GenericEmbed, TwitterEmbed, CtaButton } from '../../composables/tiptapEmbeds'
import { PullQuote } from '../../composables/tiptapPullQuote'
import { ProsCons } from '../../composables/tiptapProsCons'
import { ChartPlaceholder } from '../../composables/tiptapChartPlaceholder'
import { uploadImage } from '../../services/cloudinary'

const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const imageInput = ref(null)
const galleryInput = ref(null)
const uploadingImage = ref(false)
const uploadingGallery = ref(false)

// 'visual' = the Tiptap WYSIWYG surface. 'html' = a plain textarea whose
// value is emitted verbatim, with no parsing at all — typing "<h2>" into
// the visual editor can only ever produce literal escaped text (that's
// correct behavior for any WYSIWYG surface, not a bug), so raw HTML needs
// this separate source mode, the same way WordPress's classic editor has a
// "Text" tab alongside "Visual".
const mode = ref('visual')
const htmlSource = ref(props.modelValue)

const HEADING_OPTIONS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
]

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true }),
    Image.configure({ HTMLAttributes: { class: 'rounded-xl shadow' } }),
    Youtube.configure({ width: 640, height: 360 }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Callout,
    Gallery,
    VideoEmbed,
    GenericEmbed,
    TwitterEmbed,
    CtaButton,
    PullQuote,
    ProsCons,
    ChartPlaceholder,
    Placeholder.configure({ placeholder: 'Start writing…' }),
  ],
  editorProps: {
    attributes: { class: 'article-content focus:outline-none min-h-[320px]' },
  },
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (mode.value === 'visual') {
      if (editor.value && value !== editor.value.getHTML()) {
        editor.value.commands.setContent(value, false)
      }
    } else if (value !== htmlSource.value) {
      htmlSource.value = value
    }
  }
)

function onHtmlSourceInput(e) {
  htmlSource.value = e.target.value
  emit('update:modelValue', htmlSource.value)
}

function switchToHtml() {
  htmlSource.value = editor.value?.getHTML() ?? props.modelValue
  mode.value = 'html'
}

function switchToVisual() {
  // Loading raw HTML into the visual editor parses it through Tiptap's
  // schema — a real WYSIWYG surface, so anything the schema doesn't
  // recognize can be normalized or dropped. That's an inherent trade-off of
  // also offering visual editing; staying in HTML mode and publishing
  // directly avoids it entirely.
  editor.value?.commands.setContent(htmlSource.value, true)
  mode.value = 'visual'
}

onBeforeUnmount(() => editor.value?.destroy())

function currentHeadingValue() {
  if (!editor.value) return 'p'
  for (let level = 1; level <= 6; level++) {
    if (editor.value.isActive('heading', { level })) return `h${level}`
  }
  return 'p'
}

function onHeadingChange(e) {
  const value = e.target.value
  if (value === 'p') {
    editor.value.chain().focus().setParagraph().run()
  } else {
    editor.value.chain().focus().toggleHeading({ level: Number(value.slice(1)) }).run()
  }
}

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl || 'https://')
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function addYoutube() {
  const url = window.prompt('YouTube URL')
  if (url) editor.value.commands.setYoutubeVideo({ src: url })
}

function insertTable() {
  editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

function addProsCons() {
  const prosRaw = window.prompt('Pros — one per line')
  if (prosRaw === null) return
  const consRaw = window.prompt('Cons — one per line')
  if (consRaw === null) return
  const pros = prosRaw.split('\n').map((s) => s.trim()).filter(Boolean)
  const cons = consRaw.split('\n').map((s) => s.trim()).filter(Boolean)
  editor.value.chain().focus().setProsCons({ pros, cons }).run()
}

function addChartPlaceholder() {
  const caption = window.prompt('Caption', 'Illustrative chart — not live data')
  if (caption === null) return
  editor.value.chain().focus().setChartPlaceholder(caption).run()
}

function addVideo() {
  const url = window.prompt('Direct video URL (.mp4, .webm)')
  if (url) editor.value.chain().focus().setVideoEmbed(url).run()
}

function addEmbed() {
  const url = window.prompt('Embed URL (CodePen, Figma, Loom, etc.)')
  if (url) editor.value.chain().focus().setGenericEmbed(url).run()
}

function addTwitter() {
  const url = window.prompt('Tweet / X post URL')
  if (url) editor.value.chain().focus().setTwitterEmbed(url).run()
}

function addCtaButton() {
  const label = window.prompt('Button text', 'Start learning free')
  if (!label) return
  const href = window.prompt('Button link', 'https://')
  if (!href) return
  editor.value.chain().focus().setCtaButton({ label, href }).run()
}

async function onImageFile(e) {
  const file = e.target.files[0]
  if (!file) return
  uploadingImage.value = true
  try {
    const { url } = await uploadImage(file, { folder: 'lumen-ledger/content' })
    editor.value.chain().focus().setImage({ src: url }).run()
  } catch (err) {
    window.alert(err.message || 'Image upload failed.')
  } finally {
    uploadingImage.value = false
    e.target.value = ''
  }
}

async function onGalleryFiles(e) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  uploadingGallery.value = true
  try {
    const results = await Promise.all(files.map((f) => uploadImage(f, { folder: 'lumen-ledger/content' })))
    editor.value.chain().focus().setGallery(results.map((r) => r.url)).run()
  } catch (err) {
    window.alert(err.message || 'Gallery upload failed.')
  } finally {
    uploadingGallery.value = false
    e.target.value = ''
  }
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white">
    <div class="flex items-center justify-between gap-2 border-b border-slate-100 px-2 py-1.5">
      <span class="px-2 text-xs text-gray-400">{{ mode === 'html' ? 'Raw HTML — stored exactly as written, no parsing.' : '' }}</span>
      <div class="flex shrink-0 items-center gap-1">
        <button type="button" class="tab-btn" :class="mode === 'visual' && 'tab-btn--active'" @click="switchToVisual">Visual</button>
        <button type="button" class="tab-btn" :class="mode === 'html' && 'tab-btn--active'" @click="switchToHtml">HTML</button>
      </div>
    </div>

    <div v-if="mode === 'visual' && editor" class="flex flex-wrap items-center gap-1 border-b border-slate-100 p-2">
      <select
        class="toolbar-btn cursor-pointer border-none bg-transparent pr-1"
        :value="currentHeadingValue()"
        @change="onHeadingChange"
      >
        <option v-for="opt in HEADING_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <span class="mx-1 h-5 w-px bg-slate-200" />

      <button type="button" class="toolbar-btn font-semibold" :class="{ 'toolbar-btn--active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">B</button>
      <button type="button" class="toolbar-btn italic" :class="{ 'toolbar-btn--active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">I</button>
      <button type="button" class="toolbar-btn underline" :class="{ 'toolbar-btn--active': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">U</button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('code') }" @click="editor.chain().focus().toggleCode().run()">{{ '</>' }}</button>

      <span class="mx-1 h-5 w-px bg-slate-200" />

      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">• List</button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">1. List</button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">Quote</button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('pullQuote') }" @click="editor.chain().focus().setPullQuote().run()">Pull quote</button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('codeBlock') }" @click="editor.chain().focus().toggleCodeBlock().run()">Code block</button>
      <button type="button" class="toolbar-btn" @click="editor.chain().focus().setHorizontalRule().run()">Divider</button>

      <span class="mx-1 h-5 w-px bg-slate-200" />

      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('link') }" @click="setLink">Link</button>
      <button type="button" class="toolbar-btn" :disabled="uploadingImage" @click="imageInput.click()">
        {{ uploadingImage ? 'Uploading…' : 'Image' }}
      </button>
      <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageFile" />
      <button type="button" class="toolbar-btn" :disabled="uploadingGallery" @click="galleryInput.click()">
        {{ uploadingGallery ? 'Uploading…' : 'Gallery' }}
      </button>
      <input ref="galleryInput" type="file" accept="image/*" multiple class="hidden" @change="onGalleryFiles" />
      <button type="button" class="toolbar-btn" @click="addVideo">Video</button>
      <button type="button" class="toolbar-btn" @click="addYoutube">YouTube</button>
      <button type="button" class="toolbar-btn" @click="addTwitter">Twitter/X</button>
      <button type="button" class="toolbar-btn" @click="addEmbed">Embed</button>
      <button type="button" class="toolbar-btn" @click="insertTable">Table</button>
      <button type="button" class="toolbar-btn" @click="addProsCons">Pros/Cons</button>
      <button type="button" class="toolbar-btn" @click="addChartPlaceholder">Chart</button>
      <button type="button" class="toolbar-btn" @click="addCtaButton">Button</button>

      <span class="mx-1 h-5 w-px bg-slate-200" />

      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('callout', { variant: 'info' }) }" @click="editor.chain().focus().setCallout('info').run()">
        Info
      </button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('callout', { variant: 'warning' }) }" @click="editor.chain().focus().setCallout('warning').run()">
        Warning
      </button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('callout', { variant: 'success' }) }" @click="editor.chain().focus().setCallout('success').run()">
        Success
      </button>
      <button type="button" class="toolbar-btn" :class="{ 'toolbar-btn--active': editor.isActive('callout', { variant: 'error' }) }" @click="editor.chain().focus().setCallout('error').run()">
        Error
      </button>
      <button type="button" class="toolbar-btn" @click="editor.chain().focus().unsetCallout().run()">Clear box</button>
    </div>

    <EditorContent v-if="mode === 'visual'" :editor="editor" class="px-5 py-4" />
    <textarea
      v-else
      :value="htmlSource"
      class="block w-full resize-y border-none px-5 py-4 font-mono text-sm text-gray-800 outline-none"
      rows="20"
      spellcheck="false"
      placeholder="<h2>Heading</h2>

<p>Write raw HTML here — it is stored exactly as written.</p>"
      @input="onHtmlSourceInput"
    />
  </div>
</template>

<style scoped>
.toolbar-btn {
  border-radius: 0.5rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  transition: background-color 0.15s ease;
}
.toolbar-btn:hover {
  background-color: #f8fafc;
}
.toolbar-btn--active {
  background-color: #eff6ff;
  color: #2563eb;
}
.tab-btn {
  border-radius: 0.5rem;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.15s ease;
}
.tab-btn:hover {
  background-color: #f8fafc;
}
.tab-btn--active {
  background-color: #111827;
  color: #fff;
}
</style>
