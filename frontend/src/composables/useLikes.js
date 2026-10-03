import { ref, watch } from 'vue'

const STORAGE_KEY = 'lumen-ledger:likes'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Module-level so every component sharing this composable reads/writes the
// same reactive set instead of drifting out of sync with its own copy.
const ids = ref(new Set(readStored()))

watch(
  ids,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...val]))
    } catch {
      /* private browsing / storage quota — liking silently becomes session-only */
    }
  },
  { deep: true }
)

/**
 * Tracks which posts this browser has liked, so a like button knows its own
 * state and never double-fires the server-side increment/decrement for the
 * same visitor — there's no reader auth, so this is the whole identity model.
 */
export function useLikes() {
  function isLiked(id) {
    return ids.value.has(id)
  }

  function toggle(id) {
    const next = new Set(ids.value)
    const wasLiked = next.has(id)
    wasLiked ? next.delete(id) : next.add(id)
    ids.value = next
    return !wasLiked
  }

  return { isLiked, toggle }
}
