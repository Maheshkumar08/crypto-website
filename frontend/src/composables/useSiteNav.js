import { useRoute, useRouter } from 'vue-router'
import { useLenis } from './useLenis'

/**
 * Resolves a nav href that may be an in-page anchor ('#pricing'), a route
 * path ('/about'), or a bare marker ('#') for links with no destination yet.
 * Anchors route home first when navigating from another page.
 */
export function useSiteNav() {
  const route = useRoute()
  const router = useRouter()
  const { scrollTo } = useLenis()

  function goTo(href) {
    if (!href || href === '#') return

    if (href.startsWith('#')) {
      if (route.path !== '/') {
        router.push({ path: '/', hash: href })
      } else {
        scrollTo(href)
      }
      return
    }

    router.push(href)
  }

  return { goTo }
}
