import { Node, mergeAttributes } from '@tiptap/core'

/**
 * A simple wrapping block for "callout" boxes (info/warning/success/error).
 * Always renders as <div data-callout data-variant="...">, styled in
 * article-content.css so the same markup looks right whether it comes from
 * the editor or straight out of the database on the public post page.
 *
 * Also recognizes plain WordPress-style `<div class="info">` (etc.) markup
 * on the way in — e.g. hand-written or pasted HTML — normalizing it to the
 * same canonical data-attribute form on save, so both authoring styles end
 * up styled identically rather than needing to keep two markup shapes alive.
 */
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: (el) => el.getAttribute('data-variant') || (['info', 'warning', 'success', 'error'].find((v) => el.classList.contains(v)) ?? 'info'),
        renderHTML: (attrs) => ({ 'data-variant': attrs.variant }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }, { tag: 'div.info' }, { tag: 'div.warning' }, { tag: 'div.success' }, { tag: 'div.error' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
  },

  addCommands() {
    return {
      setCallout:
        (variant = 'info') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { variant })
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },
})
