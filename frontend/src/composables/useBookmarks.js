import { ref, watch } from 'vue'

const STORAGE_KEY = 'lumen-ledger:bookmarks'

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
      // Private browsing / storage quota — bookmarking silently becomes session-only.
    }
  },
  { deep: true }
)

/** Client-side "save for later" — there is no bookmarks backend yet, so this is per-browser only. */
export function useBookmarks() {
  function isBookmarked(id) {
    return ids.value.has(id)
  }

  function toggle(id) {
    const next = new Set(ids.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    ids.value = next
  }

  return { isBookmarked, toggle }
}
