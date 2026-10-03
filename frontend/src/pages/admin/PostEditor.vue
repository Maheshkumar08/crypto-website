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
  estimateReadingTime,
  stripHtml,
} from "../../composables/text";
import { sanitizeArticleHtml } from "../../composables/sanitizeArticleHtml";
import {
  getBlogById,
  blogSlugExists,
  createBlog,
  updateBlog,
} from "../../services/blogs";
import {
  getArticleById,
  articleSlugExists,
  createArticle,
  updateArticle,
} from "../../services/articles";
import { GUIDE_CATEGORIES } from "../../composables/guideCategories";
import { listGuideCards } from "../../services/guideCards";
import RichTextEditor from "../../components/admin/RichTextEditor.vue";
import ImageUploader from "../../components/admin/ImageUploader.vue";

const props = defineProps({
  postType: { type: String, required: true }, // 'blog' | 'article'
  id: { type: String, default: null },
});

const router = useRouter();

// blogs.js/articles.js export type-prefixed names (createBlog, blogSlugExists,
// ...) rather than a shared interface, so normalize them here into one shape
// the rest of this component can call generically regardless of postType.
const api = computed(() =>
  props.postType === "blog"
    ? {
        getById: getBlogById,
        slugExists: blogSlugExists,
        create: createBlog,
        update: updateBlog,
      }
    : {
        getById: getArticleById,
        slugExists: articleSlugExists,
        create: createArticle,
        update: updateArticle,
      },
);
const listRouteName = computed(() =>
  props.postType === "blog" ? "admin-blogs" : "admin-articles",
);

const docId = ref(props.id);
const loading = ref(!!props.id);
const saving = ref(false);
const autoSaveState = ref(""); // '' | 'saving' | 'saved'
const slugTouched = ref(false);
const previewOpen = ref(false);
const errorMsg = ref("");

const form = reactive({
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "",
  difficulty: "",
  coverImage: "",
  author: "",
  tags: "",
  featured: false,
  published: false,
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  ogImage: "",
  canonicalUrl: "",
  faqs: [],
  keyTakeaways: "",

  guideCategory: "",
  guideCardId: "",
  guideSection: "", // 👈 ADD THIS
});

const seoOpen = ref(false);
const views = ref(0);
const guideCardOptions = ref([]);
const guideCardsLoading = ref(false);

// Guide-card options only ever get (re)fetched here — never from a
// `watch(() => form.guideCategory, ...)` — so that loading an existing
// article's saved guideCategory doesn't also wipe out its saved
// guideCardId the instant the form is populated.
async function fetchGuideCardOptions(category) {
  if (!category) {
    guideCardOptions.value = [];
    return;
  }
  guideCardsLoading.value = true;
  try {
    guideCardOptions.value = await listGuideCards({ category });
  } finally {
    guideCardsLoading.value = false;
  }
}

function onGuideCategoryChange() {
  form.guideCardId = "";
  fetchGuideCardOptions(form.guideCategory);
}

function addFaq() {
  form.faqs.push({ question: "", answer: "" });
}
function removeFaq(i) {
  form.faqs.splice(i, 1);
}

const readingTime = computed(() => estimateReadingTime(form.content));
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

// A slug pasted into the SEO title would replace the readable title in the
// browser tab and search results, so it's treated as "no SEO title" (the
// post title is used instead) and never saved.
const seoTitleIsSlug = computed(() => {
  const seo = form.seoTitle.trim();
  return !!seo && (seo === form.slug || /^[a-z0-9]+(-[a-z0-9]+)+$/.test(seo));
});

async function loadExisting() {
  const post = await api.value.getById(props.id);
  if (!post) {
    errorMsg.value = "Post not found.";
    loading.value = false;
    return;
  }
  Object.assign(form, {
    title: post.title || "",
    slug: post.slug || "",
    description: post.description || "",
    content: post.content || "",
    category: post.category || "",
    difficulty: post.difficulty || "",
    coverImage: post.coverImage || "",
    author: post.author || "",
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    featured: !!post.featured,
    published: !!post.published,
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    focusKeyword: post.focusKeyword || "",
    ogImage: post.ogImage || "",
    canonicalUrl: post.canonicalUrl || "",
    faqs: Array.isArray(post.faqs) ? post.faqs.map((f) => ({ ...f })) : [],
    keyTakeaways: Array.isArray(post.keyTakeaways)
      ? post.keyTakeaways.join("\n")
      : "",
    guideCategory: post.guideCategory || "",
    guideCardId: post.guideCardId || "",
    guideSection: post.guideSection || "",
  });
  views.value = post.views || 0;
  slugTouched.value = true;
  if (form.guideCategory) await fetchGuideCardOptions(form.guideCategory);
  loading.value = false;
}

function buildPayload() {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() || stripHtml(form.content, 160),
    content: form.content,
    category: form.category.trim(),
    difficulty: form.difficulty,
    coverImage: form.coverImage,
    author: form.author.trim() || "cryptolearner.us Team",
    readingTime: readingTime.value,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    featured: form.featured,
    published: form.published,
    seoTitle: seoTitleIsSlug.value ? "" : form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
    focusKeyword: form.focusKeyword.trim(),
    ogImage: form.ogImage,
    canonicalUrl: form.canonicalUrl.trim(),
    faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
    keyTakeaways: form.keyTakeaways
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
    guideCategory: form.guideCategory,
    guideCardId: form.guideCategory ? form.guideCardId : "",
    guideSection: form.guideSection || "",
  };
}

// Writes are queued so an auto-save and a manual save can't both create the
// document before either has an id.
let persistChain = Promise.resolve();

function persist(payload) {
  const run = persistChain.then(() => write(payload));
  persistChain = run.catch(() => {});
  return run;
}

async function write(payload) {
  // Checked on every write, auto-save included. The public page loads the
  // first post with a given slug, so a duplicate makes this post unreachable.
  if (payload.slug && (await api.value.slugExists(payload.slug, docId.value))) {
    form.slug = `${payload.slug}-${Date.now().toString(36)}`;
    slugTouched.value = true;
    payload = { ...payload, slug: form.slug };
  }

  if (docId.value) {
    await api.value.update(docId.value, payload);
  } else {
    docId.value = await api.value.create(payload);
    router.replace({
      name:
        props.postType === "blog" ? "admin-blog-edit" : "admin-article-edit",
      params: { id: docId.value },
    });
  }
}

async function onSave(publish) {
  if (!form.title.trim()) {
    errorMsg.value = "Give the post a title before saving.";
    return;
  }
  errorMsg.value = "";
  saving.value = true;
  try {
    clearTimeout(autoSaveTimer);
    await persist({ ...buildPayload(), published: publish });
    form.published = publish;
    router.push({ name: listRouteName.value });
  } catch (err) {
    console.error("[post-editor] save failed:", err.code, err.message, err);
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
        console.error(
          "[post-editor] auto-save failed:",
          err.code,
          err.message,
          err,
        );
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
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <router-link
          :to="{ name: listRouteName }"
          class="text-sm font-medium text-gray-400 hover:text-gray-600"
        >
          ← Back to {{ postType === "blog" ? "blogs" : "articles" }}
        </router-link>
        <h1
          class="mt-2 font-display text-2xl font-bold tracking-tight text-gray-900"
        >
          {{ docId ? "Edit" : "New" }}
          {{ postType === "blog" ? "blog post" : "article" }}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="autoSaveState === 'saving'" class="text-xs text-gray-400"
          >Saving draft…</span
        >
        <span
          v-else-if="autoSaveState === 'saved'"
          class="text-xs text-cyan-600"
          >Draft saved</span
        >
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

    <p
      v-if="errorMsg"
      class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMsg }}
    </p>

    <div v-if="loading" class="mt-10 text-center text-sm text-gray-400">
      Loading…
    </div>

    <div v-else class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[2fr,1fr]">
      <div class="space-y-6">
        <div>
          <input
            v-model="form.title"
            type="text"
            placeholder="Post title"
            class="w-full border-none bg-transparent font-display text-3xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
          />
          <div class="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <span>/{{ postType === "blog" ? "blog" : "articles" }}/</span>
            <input
              v-model="form.slug"
              type="text"
              class="flex-1 rounded-lg border border-transparent bg-slate-50 px-2 py-1 text-sm text-gray-600 outline-none focus:border-slate-200"
              @input="onSlugInput"
            />
          </div>
        </div>

        <textarea
          v-model="form.description"
          rows="2"
          placeholder="Short description (used as excerpt and meta description)"
          class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        <RichTextEditor v-model="form.content" />

        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
        >
          <h3 class="text-sm font-semibold text-gray-900">Key takeaways</h3>
          <p class="mt-1 text-xs text-gray-400">
            Optional — one per line. Shown as a highlighted summary box
            (magazine-style pages only).
          </p>
          <textarea
            v-model="form.keyTakeaways"
            rows="4"
            placeholder="Self-custody means holding your own private keys&#10;Practice wallets remove real financial risk while learning"
            class="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">FAQs</h3>
            <button
              type="button"
              class="text-xs font-medium text-blue-600 hover:text-blue-700"
              @click="addFaq"
            >
              + Add question
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-400">
            Optional — renders as an accordion on the post and adds FAQ
            structured data.
          </p>

          <div v-if="form.faqs.length" class="mt-4 space-y-4">
            <div
              v-for="(faq, i) in form.faqs"
              :key="i"
              class="rounded-xl border border-slate-100 p-4"
            >
              <div class="flex items-start gap-2">
                <div class="flex-1 space-y-2">
                  <input
                    v-model="faq.question"
                    type="text"
                    placeholder="Question"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <textarea
                    v-model="faq.answer"
                    rows="2"
                    placeholder="Answer"
                    class="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <button
                  type="button"
                  class="mt-1 text-xs font-medium text-red-500 hover:text-red-600"
                  @click="removeFaq(i)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
        >
          <h3 class="text-sm font-semibold text-gray-900">Cover image</h3>
          <div class="mt-3">
            <ImageUploader v-model="form.coverImage" />
          </div>
        </div>

        <div
          class="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
        >
          <h3 class="text-sm font-semibold text-gray-900">Details</h3>

          <div>
            <label class="text-xs font-medium text-gray-500">Category</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Foundations"
              class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500">Difficulty</label>
            <select
              v-model="form.difficulty"
              class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="">Not set</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500">Author</label>
            <input
              v-model="form.author"
              type="text"
              placeholder="cryptolearner.us Team"
              class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500"
              >Tags (comma separated)</label
            >
            <input
              v-model="form.tags"
              type="text"
              placeholder="wallets, security"
              class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>Reading time</span>
            <span class="font-medium text-gray-900">{{ readingTime }} min</span>
          </div>
          <div
            v-if="docId"
            class="flex items-center justify-between text-sm text-gray-500"
          >
            <span>Views</span>
            <span class="font-medium text-gray-900">{{
              views.toLocaleString()
            }}</span>
          </div>

          <label
            class="flex items-center justify-between text-sm text-gray-700"
          >
            Featured
            <input
              v-model="form.featured"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
            />
          </label>
          <label
            class="flex items-center justify-between text-sm text-gray-700"
          >
            Published
            <input
              v-model="form.published"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
            />
          </label>
        </div>

        <div
          v-if="postType === 'article'"
          class="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Guide linking</h3>
            <p class="mt-1 text-xs text-gray-400">
              Optional — attach this article to a guide card so its "Read Guide"
              button opens it automatically, with no code changes.
            </p>
          </div>

          <div>
            <label class="text-xs font-medium text-gray-500"
              >Guide category</label
            >
            <select
              v-model="form.guideCategory"
              class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              @change="onGuideCategoryChange"
            >
              <option value="">None</option>
              <option
                v-for="c in GUIDE_CATEGORIES"
                :key="c.value"
                :value="c.value"
              >
                {{ c.label }}
              </option>
            </select>
          </div>

          <div v-if="form.guideCategory">
            <label class="text-xs font-medium text-gray-500">Guide card</label>
            <select
              v-model="form.guideCardId"
              class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              :disabled="guideCardsLoading"
            >
              <option value="">
                {{ guideCardsLoading ? "Loading…" : "Select a card" }}
              </option>
              <option
                v-for="card in guideCardOptions"
                :key="card.id"
                :value="card.cardId"
              >
                {{ card.title }}
              </option>
            </select>
            <p
              v-if="!guideCardsLoading && !guideCardOptions.length"
              class="mt-1.5 text-xs text-amber-600"
            >
              No guide cards exist in this category yet — add one from Guide
              Cards management.
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-slate-200/80 bg-white shadow-soft"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between p-5 text-left"
            @click="seoOpen = !seoOpen"
          >
            <h3 class="text-sm font-semibold text-gray-900">SEO</h3>
            <span
              class="text-gray-400 transition-transform duration-200"
              :class="seoOpen && 'rotate-180'"
              >⌄</span
            >
          </button>

          <div
            v-show="seoOpen"
            class="space-y-4 border-t border-slate-100 p-5 pt-4"
          >
            <div>
              <label class="text-xs font-medium text-gray-500">SEO title</label>
              <input
                v-model="form.seoTitle"
                type="text"
                :placeholder="form.title || 'Falls back to post title'"
                class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <p v-if="seoTitleIsSlug" class="mt-1.5 text-xs text-amber-700">
                This looks like a URL slug, not a title. It won't be saved —
                the post title will be used instead.
              </p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500"
                >SEO description</label
              >
              <textarea
                v-model="form.seoDescription"
                rows="2"
                :placeholder="
                  form.description || 'Falls back to short description'
                "
                class="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500"
                >Focus keyword</label
              >
              <input
                v-model="form.focusKeyword"
                type="text"
                placeholder="self-custody wallet"
                class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500"
                >Canonical URL</label
              >
              <input
                v-model="form.canonicalUrl"
                type="text"
                :placeholder="`Falls back to /${postType === 'blog' ? 'blog' : 'articles'}/${form.slug}`"
                class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">OG image</label>
              <p class="mb-1.5 text-xs text-gray-400">
                Falls back to the cover image if left empty.
              </p>
              <ImageUploader v-model="form.ogImage" />
            </div>
          </div>
        </div>
      </div>
    </div>

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
          <span class="text-sm font-medium text-gray-500">Preview</span>
          <button
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50"
            @click="previewOpen = false"
          >
            Close
          </button>
        </div>
        <article class="mx-auto max-w-3xl px-6 py-12">
          <p class="text-sm font-semibold text-blue-600">
            {{ form.category || "Uncategorized" }}
          </p>
          <h1
            class="mt-3 font-display text-4xl font-bold tracking-tight text-gray-900"
          >
            {{ form.title || "Untitled post" }}
          </h1>
          <p class="mt-4 text-lg text-gray-500">{{ form.description }}</p>
          <img
            v-if="form.coverImage"
            :src="form.coverImage"
            alt=""
            class="mt-8 w-full rounded-2xl object-cover"
          />
          <div class="article-content mt-10" v-html="previewHtml" />
        </article>
      </div>
    </Transition>
  </div>
</template>
