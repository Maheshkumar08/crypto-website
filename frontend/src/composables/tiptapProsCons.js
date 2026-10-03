import { Node, mergeAttributes } from '@tiptap/core'

function safeParseList(raw) {
  try {
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** A two-column pros/cons comparison box — each side stored as a list of plain strings. */
export const ProsCons = Node.create({
  name: 'prosCons',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      pros: {
        default: [],
        parseHTML: (el) => safeParseList(el.getAttribute('data-pros')),
        renderHTML: (attrs) => ({ 'data-pros': JSON.stringify(attrs.pros || []) }),
      },
      cons: {
        default: [],
        parseHTML: (el) => safeParseList(el.getAttribute('data-cons')),
        renderHTML: (attrs) => ({ 'data-cons': JSON.stringify(attrs.cons || []) }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-pros-cons]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const pros = node.attrs.pros || []
    const cons = node.attrs.cons || []
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-pros-cons': '', class: 'content-pros-cons' }),
      [
        'div',
        { class: 'content-pros-cons__col content-pros-cons__pros' },
        ['p', { class: 'content-pros-cons__title' }, 'Pros'],
        ...pros.map((text) => ['p', {}, `✓ ${text}`]),
      ],
      [
        'div',
        { class: 'content-pros-cons__col content-pros-cons__cons' },
        ['p', { class: 'content-pros-cons__title' }, 'Cons'],
        ...cons.map((text) => ['p', {}, `✕ ${text}`]),
      ],
    ]
  },

  addCommands() {
    return {
      setProsCons:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },
})
