import { Node, mergeAttributes } from '@tiptap/core'

/** A simple responsive image grid, stored as a JSON array of URLs on the node. */
export const Gallery = Node.create({
  name: 'gallery',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (el) => {
          try {
            return JSON.parse(el.getAttribute('data-images') || '[]')
          } catch {
            return []
          }
        },
        renderHTML: (attrs) => ({ 'data-images': JSON.stringify(attrs.images || []) }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-gallery]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const images = node.attrs.images || []
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-gallery': '', class: 'content-gallery' }),
      ...images.map((src) => ['img', { src, alt: '' }]),
    ]
  },

  addCommands() {
    return {
      setGallery:
        (images) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { images } }),
    }
  },
})
