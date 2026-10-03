<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import {
  slugify,
  stripHtml,
} from "../../composables/text";
import { sanitizeArticleHtml } from "../../composables/sanitizeArticleHtml";
import {
  getPageById,
  pageSlugExists,
  createPage,
  updatePage,
} from "../../services/pages";
import RichTextEditor from "../../components/admin/RichTextEditor.vue";
import ImageUploader from "../../components/admin/ImageUploader.vue";

const props = defineProps({
  id: { type: String, default: null },
});

const router = useRouter();

const docId = ref(props.id);
const loading = ref(!!props.id);
const saving = ref(false);
const autoSaveState = ref(""); // '' | 'saving' | 'saved'
const slugTouched = ref(false);
const previewOpen = ref(false);
const errorMsg = ref("");
const seoOpen = ref(true);

const form = reactive({
  title: "",
  slug: "",
  coverImage: "",
  shortDescription: "",
  content: "",
  seoTitle: "",
  metaDescription: "",
  published: false,
  sortOrder: 0,
});

const previewHtml = computed(() => sanitizeArticleHtml(form.content));

watch(
  () => form.title,
  (title) => {
    if (!slugTouched.value) form.slug = slugify(title);
  },
);

function onSlugInput() {
  slugTouched.value = true;
  form.slug = slugify(form.slug);
}

async function loadExisting() {
  try {
    const page = await getPageById(props.id);
    if (!page) {
      errorMsg.value = "Page not found.";
      loading.value = false;
      return;
    }
    Object.assign(form, {
      title: page.title || "",
      slug: page.slug || "",
      coverImage: page.coverImage || "",
      shortDescription: page.shortDescription || page.metaDescription || "",
      content: page.content || "",
      seoTitle: page.seoTitle || "",
      metaDescription: page.metaDescription || page.shortDescription || "",
      published: !!page.published,
      sortOrder: typeof page.sortOrder === "number" ? page.sortOrder : Number(page.sortOrder) || 0,
    });
    slugTouched.value = true;
  } catch (err) {
    console.error("[PageEditor] failed to load page:", err);
    errorMsg.value = "Failed to load page. Check the server connection.";
  } finally {
    loading.value = false;
  }
}

function buildPayload() {
  const shortDesc = form.shortDescription.trim() || stripHtml(form.content, 160);
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    coverImage: form.coverImage,
    shortDescription: shortDesc,
    content: form.content,
    seoTitle: form.seoTitle.trim(),
    metaDescription: form.metaDescription.trim() || shortDesc,
    published: form.published,
    sortOrder: Number(form.sortOrder) || 0,
  };
}

async function persist(payload) {
  if (docId.value) {
    await updatePage(docId.value, payload);
  } else {
    docId.value = await createPage(payload);
    router.replace({
      name: "admin-page-edit",
      params: { id: docId.value },
    });
  }
}

async function onSave(publish) {
  if (!form.title.trim()) {
    errorMsg.value = "Give the page a title before saving.";
    return;
  }
  if (!form.slug.trim()) {
    form.slug = slugify(form.title);
  }
  errorMsg.value = "";
  saving.value = true;
  try {
    const exists = await pageSlugExists(form.slug, docId.value);
    if (exists) {
      form.slug = `${form.slug}-${Date.now().toString(36)}`;
    }
    await persist({ ...buildPayload(), published: publish });
    form.published = publish;
    router.push({ name: "admin-pages" });
  } catch (err) {
    console.error("[PageEditor] save failed:", err);
    errorMsg.value = import.meta.env.DEV
      ? `${err.code || "unknown-error"} — ${err.message || "Save failed."}`
      : "Could not save — check the server connection.";
  } finally {
    saving.value = false;
  }
}

// Auto-save draft: debounced, silent, only once there is a real title.
let autoSaveTimer = null;
watch(
  () => JSON.stringify(form),
  () => {
    if (loading.value || !form.title.trim()) return;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      autoSaveState.value = "saving";
      try {
        await persist(buildPayload());
        autoSaveState.value = "saved";
      } catch (err) {
        console.error("[PageEditor] auto-save failed:", err);
        autoSaveState.value = "";
      }
    }, 2000);
  },
);

onBeforeUnmount(() => clearTimeout(autoSaveTimer));

onMounted(() => {
  if (props.id) loadExisting();
});
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <!-- Header bar -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <router-link
          :to="{ name: 'admin-pages' }"
          class="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to pages
        </router-link>
        <h1 class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900">
          {{ docId ? "Edit" : "New" }} Page
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="autoSaveState === 'saving'" class="text-xs text-gray-400">
          Saving draft…
        </span>
        <span v-else-if="autoSaveState === 'saved'" class="text-xs text-cyan-600">
          Draft saved
        </span>
        <button
          type="button"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50"
          @click="previewOpen = true"
        >
          Preview
        </button>
        <button
          type="button"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50"
          :disabled="saving"
          @click="onSave(false)"
        >
          Save draft
        </button>
        <button
          type="button"
          class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          :disabled="saving"
          @click="onSave(true)"
        >
          {{ form.published ? "Update & publish" : "Publish" }}
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <p
      v-if="errorMsg"
      class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMsg }}
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="mt-10 text-center text-sm text-gray-400">
      Loading page…
    </div>

    <!-- Main Grid Form -->
    <div v-else class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[2fr,1fr]">
      <!-- Left Column: Title, Slug, Short Description, Rich Text Content -->
      <div class="space-y-6">
        <div>
          <input
            v-model="form.title"
            type="text"
            placeholder="Page title (e.g. Bitcoin Guide, Web3 Overview)"
            class="w-full border-none bg-transparent font-display text-3xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
          />
          <div class="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <span class="font-mono text-gray-500">/</span>
            <input
              v-model="form.slug"
              type="text"
              placeholder="page-slug"
              class="flex-1 rounded-lg border border-transparent bg-slate-50 px-2 py-1 text-sm font-mono text-gray-700 outline-none focus:border-slate-200"
              @input="onSlugInput"
            />
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-medium text-gray-500">
            Short Description
          </label>
          <textarea
            v-model="form.shortDescription"
            rows="3"
            placeholder="Brief summary used on the Home Page card and as search excerpt"
            class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-medium text-gray-500">
            Page Content (Rich HTML)
          </label>
          <RichTextEditor v-model="form.content" />
        </div>
      </div>

      <!-- Right Column: Settings, Cover Image & SEO -->
      <div class="space-y-6">
        <!-- Cover Image -->
        <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <h3 class="text-sm font-semibold text-gray-900">Cover image</h3>
          <p class="mt-1 text-xs text-gray-400">Featured image shown on the card and at top of the page.</p>
          <div class="mt-3">
            <ImageUploader v-model="form.coverImage" />
          </div>
        </div>

        <!-- Page Settings -->
        <div class="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <h3 class="text-sm font-semibold text-gray-900">Page Settings</h3>

          <!-- Sort Order -->
          <div>
            <label class="text-xs font-medium text-gray-500">Sort Order</label>
            <p class="text-xs text-gray-400">Lower numbers appear first on the home page.</p>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div class="border-t border-slate-100 pt-3">
            <!-- Published Toggle -->
            <label class="flex items-center justify-between text-sm text-gray-700 cursor-pointer">
              <div>
                <span class="font-medium">Published</span>
                <p class="text-xs text-gray-400">Publicly visible on the website</p>
              </div>
              <input
                v-model="form.published"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <!-- SEO Settings -->
        <div class="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
          <button
            type="button"
            class="flex w-full items-center justify-between p-5 text-left"
            @click="seoOpen = !seoOpen"
          >
            <div>
              <h3 class="text-sm font-semibold text-gray-900">SEO Settings</h3>
              <p class="text-xs text-gray-400">Search engine title and metadata</p>
            </div>
            <span
              class="text-gray-400 transition-transform duration-200"
              :class="seoOpen && 'rotate-180'"
            >
              ⌄
            </span>
          </button>

          <div
            v-show="seoOpen"
            class="space-y-4 border-t border-slate-100 p-5 pt-4"
          >
            <div>
              <label class="text-xs font-medium text-gray-500">SEO Title</label>
              <input
                v-model="form.seoTitle"
                type="text"
                :placeholder="form.title || 'Defaults to page title'"
                class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500">Meta Description</label>
              <textarea
                v-model="form.metaDescription"
                rows="3"
                placeholder="Brief summary for Google search results and social cards"
                class="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="previewOpen"
        class="fixed inset-0 z-[200] overflow-y-auto bg-white"
      >
        <div
          class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500">Page Preview</span>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-gray-600">
              /{{ form.slug || 'untitled' }}
            </span>
          </div>
          <button
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 transition-colors"
            @click="previewOpen = false"
          >
            Close
          </button>
        </div>

        <main class="mx-auto max-w-4xl px-6 py-12">
          <img
            v-if="form.coverImage"
            :src="form.coverImage"
            alt=""
            class="mb-8 w-full rounded-2xl object-cover max-h-[460px]"
          />

          <h1 class="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {{ form.title || "Untitled Page" }}
          </h1>

          <p v-if="form.shortDescription" class="mt-4 text-lg text-gray-600">
            {{ form.shortDescription }}
          </p>

          <div class="article-content mt-10" v-html="previewHtml" />
        </main>
      </div>
    </Transition>
  </div>
</template>
