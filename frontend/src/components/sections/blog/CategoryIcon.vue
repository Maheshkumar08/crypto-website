<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
})

// Keyword match against the category label rather than an exact lookup, so
// an admin-created "Layer 2 Scaling" or "NFT Drops" still resolves to a
// sensible icon without the frontend needing to know every possible name.
const KEYWORD_ICONS = [
  [['featured'], 'star'],
  [['beginner', 'basics', 'foundations'], 'seed'],
  [['bitcoin', 'btc'], 'bitcoin'],
  [['ethereum', 'eth'], 'ethereum'],
  [['altcoin'], 'coins'],
  [['trading', 'trade'], 'trend'],
  [['wallet', 'custody'], 'wallet'],
  [['security', 'secure'], 'shield'],
  [['scam', 'fraud'], 'alert'],
  [['news', 'update'], 'news'],
  [['guide'], 'compass'],
  [['tutorial', 'course', 'lesson'], 'cap'],
  [['defi'], 'layers'],
  [['nft', 'collectible'], 'frame'],
  [['airdrop'], 'gift'],
  [['meme'], 'rocket'],
  [['layer 2', 'layer2', 'l2', 'scaling'], 'stack'],
]

const resolved = computed(() => {
  const n = props.name.toLowerCase()
  if (n === 'all' || n === 'all articles') return 'grid'
  for (const [keywords, icon] of KEYWORD_ICONS) {
    if (keywords.some((k) => n.includes(k))) return icon
  }
  return 'tag'
})
</script>

<template>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]">
    <template v-if="resolved === 'star'">
      <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9 2.6-5.5Z" />
    </template>
    <template v-else-if="resolved === 'seed'">
      <path d="M12 21c0-6-4-9-8-9 0 6 4 9 8 9Z" />
      <path d="M12 21c0-8 4-13 8-13 0 8-4 13-8 13Z" />
    </template>
    <template v-else-if="resolved === 'bitcoin'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 8h3.3a2 2 0 0 1 0 4h-3.3m0 0h3.7a2 2 0 0 1 0 4h-3.7m0-8v8m0-8V6.5m0 9.5V17.5M13.4 8V6.5m0 9.5V17.5" />
    </template>
    <template v-else-if="resolved === 'ethereum'">
      <path d="M12 3v7.2L17.5 13 12 3Z" />
      <path d="M12 3 6.5 13 12 10.2V3Z" />
      <path d="M12 21v-5.6l5.5-3.9L12 21Z" />
      <path d="M12 21v-5.6L6.5 11.5 12 21Z" />
    </template>
    <template v-else-if="resolved === 'coins'">
      <ellipse cx="9" cy="8" rx="5.5" ry="3" />
      <path d="M3.5 8v3c0 1.66 2.46 3 5.5 3s5.5-1.34 5.5-3V8" />
      <ellipse cx="15" cy="15" rx="5.5" ry="3" />
      <path d="M9.5 15v2c0 1.66 2.46 3 5.5 3s5.5-1.34 5.5-3v-2" />
    </template>
    <template v-else-if="resolved === 'trend'">
      <path d="M3.5 16.5 9 11l4 4 7.5-8.5" />
      <path d="M15.5 6.5h5v5" />
    </template>
    <template v-else-if="resolved === 'wallet'">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18" />
      <circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="resolved === 'shield'">
      <path d="M12 3.5 5 6v5.2c0 4.4 3 8 7 9.3 4-1.3 7-4.9 7-9.3V6l-7-2.5Z" />
      <path d="M9.2 12.2l1.9 1.9 3.7-3.9" />
    </template>
    <template v-else-if="resolved === 'alert'">
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="resolved === 'news'">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M7 9h6M7 12.5h10M7 16h10" />
    </template>
    <template v-else-if="resolved === 'compass'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" />
    </template>
    <template v-else-if="resolved === 'cap'">
      <path d="M12 5 2.5 9.5 12 14l9.5-4.5L12 5Z" />
      <path d="M6.5 11.7V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.3" />
    </template>
    <template v-else-if="resolved === 'layers'">
      <path d="m12 4 8 4.5-8 4.5-8-4.5L12 4Z" />
      <path d="m4 13 8 4.5 8-4.5" />
    </template>
    <template v-else-if="resolved === 'frame'">
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <circle cx="9.5" cy="9.5" r="1.6" />
      <path d="m5.5 17 4.5-4.5 3 3 2-2 3.5 3.5" />
    </template>
    <template v-else-if="resolved === 'gift'">
      <rect x="3.5" y="9.5" width="17" height="10" rx="1.5" />
      <path d="M3.5 13.5h17M12 9.5v10" />
      <path d="M12 9.5c-4-1-4.5-5 0-5s1 4 0 5c1-1 4.5 0 4.5 0M12 9.5c1-1-2.5-4-4.5 0" />
    </template>
    <template v-else-if="resolved === 'rocket'">
      <path d="M12 3c3 1.5 5 4.7 5 8.5 0 2-1 4-2.4 5.4L12 19l-2.6-2.1C8 15.5 7 13.5 7 11.5 7 7.7 9 4.5 12 3Z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M9 16.5 7 20l3-1.2M15 16.5l2 3.5-3-1.2" />
    </template>
    <template v-else-if="resolved === 'stack'">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </template>
    <template v-else-if="resolved === 'grid'">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.8" />
    </template>
    <template v-else>
      <path d="M12 3 5 10v9a1 1 0 0 0 1 1h5l8-8a3 3 0 0 0 0-4.2L15.2 3.8A3 3 0 0 0 12 3Z" />
      <circle cx="9.5" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>
