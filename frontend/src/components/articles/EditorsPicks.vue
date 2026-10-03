<script setup>
defineProps({
  posts: { type: Array, required: true },
})
</script>

<template>
  <div v-if="posts.length" class="hover-glow rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
    <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Editor's picks</h3>
    <div class="mt-4 divide-y divide-slate-200">
      <router-link
        v-for="(post, i) in posts"
        :key="post.id"
        :to="`/articles/${post.slug}`"
        data-cursor-hover
        class="group flex items-start gap-3 py-4 first:pt-0"
      >
        <span class="rank-numeral mt-0.5 text-xl">{{ i + 1 }}</span>
        <div class="min-w-0">
          <p class="font-display text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {{ post.title }}
          </p>
          <p class="mt-1.5 text-xs text-gray-400">{{ post.category }} · {{ post.readingTime }} min read</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
