// Single source of truth for the 6 learning-page categories — used by the
// admin PostEditor's "Guide category" dropdown, the Guide Cards management
// page, and nowhere else needs it (each public page passes its own fixed
// category value directly).
export const GUIDE_CATEGORIES = [
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'safety', label: 'Safety' },
  { value: 'coins', label: 'Coins' },
  { value: 'exchanges', label: 'Exchanges' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'glossary', label: 'Glossary' }, 
]

export function guideCategoryLabel(value) {
  return GUIDE_CATEGORIES.find((c) => c.value === value)?.label || value
}
