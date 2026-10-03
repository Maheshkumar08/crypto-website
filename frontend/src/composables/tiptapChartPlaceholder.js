import { Node, mergeAttributes } from '@tiptap/core'

/**
 * A decorative bar-chart placeholder for illustrating a concept (e.g. "gas
 * fees over time") without a live data source. Deliberately labeled as a
 * placeholder in its own markup — this is a crypto-education site, so it
 * must never look like a real, data-backed chart.
 */
export const ChartPlaceholder = Node.create({
  name: 'chartPlaceholder',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      caption: { default: 'Illustrative chart — not live data' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-chart-placeholder]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const bars = [40, 65, 50, 80, 60, 90, 70]
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-chart-placeholder': '', class: 'content-chart' }),
      [
        'div',
        { class: 'content-chart__bars' },
        ...bars.map((h) => ['span', { style: `height:${h}%` }]),
      ],
      ['p', { class: 'content-chart__caption' }, node.attrs.caption],
    ]
  },

  addCommands() {
    return {
      setChartPlaceholder:
        (caption) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { caption } }),
    }
  },
})
