<script setup>
import { computed, onMounted, ref } from "vue";
import { getBlogs } from "../../services/blogs";
import { getArticles } from "../../services/articles";
import { formatDate } from "../../composables/text";
import StatCard from "../../components/admin/StatCard.vue";

const blogs = ref([]);
const articles = ref([]);
const loading = ref(true);
const error = ref("");

const publishedBlogs = computed(() => blogs.value.filter((b) => b.published));
const draftBlogs = computed(() => blogs.value.filter((b) => !b.published));
const publishedArticles = computed(() =>
  articles.value.filter((a) => a.published),
);

const recentPosts = computed(() => {
  return [
    ...blogs.value.map((b) => ({ ...b, kind: "Blog" })),
    ...articles.value.map((a) => ({ ...a, kind: "Article" })),
  ]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 6);
});

onMounted(async () => {
  try {
    const [b, a] = await Promise.all([
      getBlogs({ publishedOnly: false }),
      getArticles({ publishedOnly: false }),
    ]);
    blogs.value = b;
    articles.value = a;
  } catch (err) {
    error.value =
      'Could not load posts. Check that the server is running and MONGODB_URI is set in .env.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1
          class="font-display text-2xl font-bold tracking-tight text-gray-900"
        >
          Dashboard
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          An overview of everything published on cryptolearner.us.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <router-link
          :to="{ name: 'admin-page-new' }"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50"
        >
          New page
        </router-link>
        <router-link
          :to="{ name: 'admin-blog-new' }"
          class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          New blog post
        </router-link>
        <router-link
          :to="{ name: 'admin-article-new' }"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50"
        >
          New article
        </router-link>
      </div>
    </div>

    <p
      v-if="error"
      class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      {{ error }}
    </p>

    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total blogs"
        :value="loading ? '—' : blogs.length"
        icon="book"
      />
      <StatCard
        label="Total articles"
        :value="loading ? '—' : articles.length"
        icon="file"
      />
      <StatCard
        label="Published"
        :value="
          loading ? '—' : publishedBlogs.length + publishedArticles.length
        "
        icon="eye"
      />
      <StatCard
        label="Drafts"
        :value="loading ? '—' : draftBlogs.length"
        icon="draft"
      />
    </div>

    <div
      class="mt-10 rounded-2xl border border-slate-200/80 bg-white shadow-soft"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 px-6 py-5"
      >
        <h2 class="text-base font-semibold text-gray-900">Recent posts</h2>
      </div>

      <div v-if="loading" class="px-6 py-10 text-center text-sm text-gray-400">
        Loading…
      </div>
      <div
        v-else-if="!recentPosts.length"
        class="px-6 py-10 text-center text-sm text-gray-400"
      >
        Nothing published yet — create your first post to see it here.
      </div>
      <ul v-else class="divide-y divide-slate-100">
        <li
          v-for="post in recentPosts"
          :key="post.kind + post.id"
          class="flex items-center justify-between px-6 py-4"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-gray-900">
              {{ post.title }}
            </p>
            <p class="mt-0.5 text-xs text-gray-400">
              {{ post.kind }} · {{ formatDate(post.createdAt) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="
                post.published
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'bg-slate-100 text-gray-500'
              "
            >
              {{ post.published ? "Published" : "Draft" }}
            </span>
            <router-link
              :to="{
                name:
                  post.kind === 'Blog'
                    ? 'admin-blog-edit'
                    : 'admin-article-edit',
                params: { id: post.id },
              }"
              class="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Edit
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
