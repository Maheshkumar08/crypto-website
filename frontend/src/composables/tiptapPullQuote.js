import { Node, mergeAttributes } from '@tiptap/core'

/** A large, centered pull-quote — visually distinct from a regular blockquote. */
export const PullQuote = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: 'blockquote[data-pull-quote]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(HTMLAttributes, { 'data-pull-quote': '' }), 0]
  },

  addCommands() {
    return {
      setPullQuote:
        () =>
        ({ commands }) =>
          commands.wrapIn(this.name),
      unsetPullQuote:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    }
  },
})
