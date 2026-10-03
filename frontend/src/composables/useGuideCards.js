import { inject, onMounted, onServerPrefetch, ref } from 'vue'
import { listGuideCards } from '../services/guideCards'
import { getArticles } from '../services/articles'
import { PRERENDER_STATE, getServerGuideCards, getServerPosts, reviveDates } from './serverData'

// A card only needs to know where its article is, not the article body.
function linkedArticle({ content, faqs, keyTakeaways, ...rest }) {
  return rest
}

function joinCards(guideCards, articles) {
  const byCardId = new Map(articles.filter((a) => a.guideCardId).map((a) => [a.guideCardId, a]))
  return guideCards.map((card) => {
    const article = byCardId.get(card.cardId)
    return { ...card, article: article ? linkedArticle(article) : null }
  })
}

/**
 * Loads the enabled guide cards for one category and resolves each card's
 * linked article, if any published article carries a matching
 * `guideCardId` — one extra query total (not one per card), joined so
 * publishing a new article never requires a code change or redeploy to
 * appear on its card.
 *
 * Loaded on the server (the cards are in the page's HTML) and handed to the
 * browser in the page state; fetched in the browser only without it.
 */
export function useGuideCards(category) {
  const cards = ref([])
  const loading = ref(true)
  const error = ref('')

  const prerenderState = inject(PRERENDER_STATE, null)
  const stateKey = `guide-cards:${category}`

  if (import.meta.env.SSR) {
    onServerPrefetch(async () => {
      try {
        const [guideCards, articles] = await Promise.all([getServerGuideCards(category), getServerPosts('articles')])
        cards.value = joinCards(guideCards, articles)
      } catch (err) {
        console.error('[guide-cards] server render failed:', err)
        error.value = 'Could not load guides right now.'
      }
      loading.value = false
      if (prerenderState && !error.value) prerenderState[stateKey] = cards.value
    })
  } else {
    const prerendered = prerenderState?.[stateKey]
    if (prerendered) {
      delete prerenderState[stateKey]
      cards.value = reviveDates(prerendered)
      loading.value = false
    } else {
      onMounted(async () => {
        try {
          const [guideCards, articles] = await Promise.all([
            listGuideCards({ category, enabledOnly: true }),
            getArticles({ publishedOnly: true }),
          ])
          cards.value = joinCards(guideCards, articles)
        } catch (err) {
          console.error('[guide-cards] load failed:', err.code, err.message, err)
          error.value = 'Could not load guides right now.'
        } finally {
          loading.value = false
        }
      })
    }
  }

  return { cards, loading, error }
}
