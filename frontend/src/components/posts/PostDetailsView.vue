<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { gsap } from "../../composables/gsapSetup";
import { revealUp } from "../../composables/useReveal";
import { usePostDetails } from "../../composables/usePostDetails";
import { useSeoMeta, SITE_URL } from "../../composables/useSeoMeta";
import { articlePageSchema } from "../../composables/seoSchemas";
import { formatDate } from "../../composables/text";
import { optimizedUrl } from "../../services/cloudinary";

import Breadcrumbs from "../ui/Breadcrumbs.vue";
import Badge from "../ui/Badge.vue";
import Avatar from "../ui/Avatar.vue";
import ReadingProgressBar from "./ReadingProgressBar.vue";
import FloatingShareBar from "./FloatingShareBar.vue";
import TableOfContents from "./TableOfContents.vue";
import AuthorCard from "./AuthorCard.vue";
import ShareButtons from "./ShareButtons.vue";
import TagList from "./TagList.vue";
import SummaryCard from "./SummaryCard.vue";
import KeyTakeaways from "./KeyTakeaways.vue";
import FaqAccordion from "./FaqAccordion.vue";
import NewsletterSignup from "./NewsletterSignup.vue";
import RelatedPosts from "./RelatedPosts.vue";
import CommentsPlaceholder from "./CommentsPlaceholder.vue";
import CtaBanner from "../sections/CtaBanner.vue";

const props = defineProps({
  getFn: { type: Function, required: true },
  listFn: { type: Function, required: true },
  incrementViewsFn: { type: Function, default: null },
  basePath: { type: String, required: true }, // '/blog' | '/articles'
  listRouteName: { type: String, required: true }, // 'blog' | 'articles'
  jsonLdType: { type: String, default: "BlogPosting" },
  variant: { type: String, default: "blog" }, // 'blog' | 'magazine'
});

const {
  post,
  loading,
  notFound,
  error,
  contentHtml,
  headings,
  related,
  prevPost,
  nextPost,
} = usePostDetails({
  getFn: props.getFn,
  listFn: props.listFn,
  incrementViewsFn: props.incrementViewsFn,
});

const articleEl = ref(null);
const headerEl = ref(null);
const coverEl = ref(null);
const bodyEl = ref(null);
const asideEl = ref(null);
const extrasEl = ref(null);

const shareUrl = computed(() =>
  post.value ? `${SITE_URL}${props.basePath}/${post.value.slug}` : SITE_URL,
);
const isMagazine = computed(() => props.variant === "magazine");

// The article loads async, so the entrance plays once the DOM for it exists
// rather than on component mount.
watch(post, async (value) => {
  if (!value) return;
  await nextTick();

  if (isMagazine.value) {
    gsap.set(coverEl.value, { clipPath: "inset(0% 0% 100% 0%)", scale: 1.1 });
    gsap.set(headerEl.value, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ delay: 0.05 });
    tl.to(
      coverEl.value,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.3,
        ease: "power4.out",
      },
      0,
    ).to(
      headerEl.value,
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.7",
    );
    gsap.set(bodyEl.value, { opacity: 0, y: 16 });
    tl.to(
      bodyEl.value,
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3",
    );
  } else {
    gsap.set([headerEl.value, coverEl.value], { opacity: 0, y: 24 });
    gsap.set(bodyEl.value, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.05 });
    tl.to(headerEl.value, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    })
      .to(
        coverEl.value,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.45",
      )
      .to(
        bodyEl.value,
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );
  }

  if (asideEl.value) {
    revealUp(asideEl.value.children, {
      trigger: asideEl.value,
      start: "top 90%",
      y: 20,
      stagger: 0.1,
    });
  }
  if (extrasEl.value) {
    revealUp(extrasEl.value.children, {
      trigger: extrasEl.value,
      start: "top 88%",
      y: 24,
      stagger: 0.12,
    });
  }
});

useSeoMeta(() => {
  if (!post.value) return null;
  const p = post.value;
  const path = `${props.basePath}/${p.slug}`;
  const url = `${SITE_URL}${path}`;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.description,
    path,
    canonical: p.canonicalUrl || url,
    image: p.ogImage || p.coverImage,
    keywords: p.focusKeyword || p.tags?.join(", "),
    type: "article",
    jsonLd: articlePageSchema({
      post: p,
      url,
      kind: props.jsonLdType,
      breadcrumbItems: [
        {
          label: props.listRouteName === "blog" ? "Blog" : "Articles",
          path: props.basePath,
        },
        { label: p.title },
      ],
    }),
  };
});
</script>

<template>
  <ReadingProgressBar v-if="post" :target="articleEl" />
  <FloatingShareBar v-if="post" :title="post.title" :url="shareUrl" />

  <div v-if="loading" class="px-6 pt-40 text-center text-sm text-gray-400">
    Loading…
  </div>

  <div
    v-else-if="notFound || error"
    class="mx-auto max-w-lg px-6 pt-40 pb-16 text-center"
  >
    <h1 class="font-display text-3xl font-bold text-gray-900">
      {{ error ? "Something went wrong" : "Post not found" }}
    </h1>
    <p class="mt-3 text-gray-500">
      {{ error || "This post may have been unpublished or moved." }}
    </p>
    <router-link
      :to="{ name: listRouteName }"
      class="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      ← Back
    </router-link>
  </div>

  <article v-else ref="articleEl" class="pb-16">
    <div class="px-6 pt-28 lg:px-10" :class="isMagazine ? '' : 'pt-36'">
      <div class="mx-auto max-w-3xl">
        <Breadcrumbs
          :items="[
            {
              label: listRouteName === 'blog' ? 'Blog' : 'Articles',
              to: basePath,
            },
            { label: post.title },
          ]"
        />
      </div>
    </div>

    <!-- Magazine variant: full-bleed cover-behind-title hero -->
    <header
      v-if="isMagazine"
      class="relative isolate mt-6 min-h-[78vh] overflow-hidden bg-gray-950"
    >
      <div class="absolute inset-0">
        <img
          v-if="post.coverImage"
          ref="coverEl"
          :src="optimizedUrl(post.coverImage, { width: 1600 })"
          :alt="post.title"
          fetchpriority="high"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          ref="coverEl"
          class="h-full w-full bg-[radial-gradient(60%_60%_at_20%_20%,rgba(37,99,235,0.35),transparent_60%),radial-gradient(50%_60%_at_85%_75%,rgba(6,182,212,0.3),transparent_60%)]"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/15"
        />
      </div>

      <div
        ref="headerEl"
        class="relative flex min-h-[78vh] flex-col justify-end px-6 pb-14 lg:px-10"
      >
        <div class="mx-auto w-full max-w-5xl">
          <Badge v-if="post.category" color="white" variant="soft">{{
            post.category
          }}</Badge>
          <h1
            class="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {{ post.title }}
          </h1>
          <div
            class="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70"
          >
            <div class="flex items-center gap-3">
              <Avatar :name="post.author || 'cryptolearner.us'" size="sm" />
              <span class="font-medium text-white">{{ post.author }}</span>
            </div>
            <span class="h-1 w-1 rounded-full bg-white/40" />
            <span>{{ formatDate(post.createdAt) }}</span>
            <span class="h-1 w-1 rounded-full bg-white/40" />
            <span>{{ post.readingTime }} min read</span>
            <template v-if="post.views">
              <span class="h-1 w-1 rounded-full bg-white/40" />
              <span>{{ post.views.toLocaleString() }} views</span>
            </template>
            <span class="h-1 w-1 rounded-full bg-white/40" />
            <div
              class="[&_a]:border-white/20 [&_a]:text-white/80 [&_a]:hover:border-white/40 [&_a]:hover:text-white [&_button]:border-white/20 [&_button]:text-white/80 [&_button]:hover:border-white/40 [&_button]:hover:text-white"
            >
              <ShareButtons :title="post.title" :url="shareUrl" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Blog variant: centered, intimate, Medium-style header -->
    <template v-else>
      <header
        ref="headerEl"
        class="mx-auto mt-8 max-w-3xl px-6 text-center lg:px-10"
      >
        <span class="text-sm font-semibold text-blue-600">{{
          post.category
        }}</span>
        <h1
          class="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
        >
          {{ post.title }}
        </h1>
        <div
          class="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400"
        >
          <Avatar :name="post.author || 'cryptolearner.us'" size="sm" />
          <span class="font-medium text-gray-700">{{ post.author }}</span>
          <span>·</span>
          <span>{{ formatDate(post.createdAt) }}</span>
          <span>·</span>
          <span>{{ post.readingTime }} min read</span>
          <template v-if="post.views">
            <span>·</span>
            <span>{{ post.views.toLocaleString() }} views</span>
          </template>
        </div>
      </header>

      <img
        v-if="post.coverImage"
        ref="coverEl"
        :src="optimizedUrl(post.coverImage, { width: 1200 })"
        :alt="post.title"
        class="mx-auto mt-10 w-full max-w-5xl rounded-2xl object-cover shadow-lift"
      />
    </template>

    <div class="px-6 lg:px-10" :class="isMagazine ? 'mt-14' : 'mt-14'">
      <div
        ref="bodyEl"
        class="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[1fr,220px]"
      >
        <div class="min-w-0 lg:order-1">
          <div
            v-if="isMagazine"
            class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <SummaryCard :summary="post.description" />
            <KeyTakeaways :items="post.keyTakeaways" />
          </div>

          <div
            class="rich-content prose prose-slate max-w-none first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:font-bold first-letter:text-blue-600"
            :class="
              isMagazine
                ? 'prose-lg first-letter:text-7xl'
                : 'first-letter:text-6xl'
            "
            v-html="contentHtml"
          />

          <div class="mt-10 border-t border-slate-100 pt-8">
            <TagList :tags="post.tags" />
          </div>

          <div class="mt-8 border-t border-slate-100 pt-8">
            <p class="mb-3 text-sm font-medium text-gray-500">
              Share this post
            </p>
            <ShareButtons :title="post.title" :url="shareUrl" />
          </div>

          <div class="mt-8 lg:hidden">
            <AuthorCard :author="post.author" />
          </div>

          <nav
            class="mt-10 grid grid-cols-1 gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2"
          >
            <router-link
              v-if="prevPost"
              :to="`${basePath}/${prevPost.slug}`"
              data-cursor-hover
              class="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft"
            >
              <div
                class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  v-if="prevPost.coverImage"
                  :src="optimizedUrl(prevPost.coverImage, { width: 112 })"
                  :alt="prevPost.title"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="min-w-0">
                <p class="flex items-center gap-1 text-xs text-gray-400">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="h-3 w-3"
                  >
                    <path d="M12 4 6 10l6 6" />
                  </svg>
                  Previous
                </p>
                <p
                  class="mt-1 truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600"
                >
                  {{ prevPost.title }}
                </p>
              </div>
            </router-link>
            <router-link
              v-if="nextPost"
              :to="`${basePath}/${nextPost.slug}`"
              data-cursor-hover
              class="group flex items-center justify-end gap-4 overflow-hidden rounded-2xl border border-slate-200 p-4 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft sm:col-start-2"
            >
              <div class="min-w-0">
                <p
                  class="flex items-center justify-end gap-1 text-xs text-gray-400"
                >
                  Next
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="h-3 w-3"
                  >
                    <path d="m8 4 6 6-6 6" />
                  </svg>
                </p>
                <p
                  class="mt-1 truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600"
                >
                  {{ nextPost.title }}
                </p>
              </div>
              <div
                class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  v-if="nextPost.coverImage"
                  :src="optimizedUrl(nextPost.coverImage, { width: 112 })"
                  :alt="nextPost.title"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
              </div>
            </router-link>
          </nav>
        </div>

        <aside ref="asideEl" class="hidden lg:order-2 lg:block">
          <div class="sticky top-28 space-y-8">
            <TableOfContents :headings="headings" />
            <AuthorCard :author="post.author" />
          </div>
        </aside>
      </div>
    </div>

    <div ref="extrasEl">
      <div
        v-if="post.faqs?.length"
        class="mx-auto mt-16 max-w-5xl px-6 lg:px-10"
      >
        <FaqAccordion :faqs="post.faqs" />
      </div>

      <div class="mx-auto mt-16 max-w-3xl px-6 lg:px-10">
        <NewsletterSignup :source="listRouteName" />
      </div>
    </div>
  </article>

  <RelatedPosts v-if="post" :posts="related" :base-path="basePath" />

  <div v-if="post" class="px-6 pb-16 lg:px-10">
    <CtaBanner />
    <div class="mx-auto mt-16 max-w-3xl">
      <CommentsPlaceholder />
    </div>
  </div>
</template>
