import { Node, mergeAttributes } from '@tiptap/core'

/** Direct video file (mp4/webm) — a native <video> element, not a third-party embed. */
export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return { src: { default: '' } }
  },

  parseHTML() {
    return [{ tag: 'video[data-video-embed]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, { 'data-video-embed': '', controls: 'true', class: 'content-video' })]
  },

  addCommands() {
    return {
      setVideoEmbed:
        (src) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    }
  },
})

/** Generic iframe embed (CodePen, Figma, Loom, etc.) — any embeddable URL. */
export const GenericEmbed = Node.create({
  name: 'genericEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return { src: { default: '' } }
  },

  parseHTML() {
    return [{ tag: 'iframe[data-generic-embed]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        'data-generic-embed': '',
        class: 'content-embed',
        frameborder: '0',
        allowfullscreen: 'true',
        loading: 'lazy',
      }),
    ]
  },

  addCommands() {
    return {
      setGenericEmbed:
        (src) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    }
  },
})

/**
 * A styled card linking out to a tweet — deliberately not Twitter's widgets.js
 * embed (that requires loading a third-party script into every post page for
 * a single block type). Trades a live-rendered tweet for something that
 * always works, loads instantly, and never breaks if the API changes.
 */
export const TwitterEmbed = Node.create({
  name: 'twitterEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return { url: { default: '' } }
  },

  parseHTML() {
    return [{ tag: 'a[data-twitter-embed]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        'data-twitter-embed': '',
        href: node.attrs.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'content-twitter',
      }),
      `View post on X — ${node.attrs.url}`,
    ]
  },

  addCommands() {
    return {
      setTwitterEmbed:
        (url) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { url } }),
    }
  },
})

/** A styled CTA button, for driving readers to a course/pricing/contact link mid-post. */
export const CtaButton = Node.create({
  name: 'ctaButton',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label: { default: 'Learn more' },
      href: { default: '#' },
    }
  },

  parseHTML() {
    return [{ tag: 'a[data-cta-button]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, { 'data-cta-button': '', href: node.attrs.href, class: 'content-cta-button' }),
      node.attrs.label,
    ]
  },

  addCommands() {
    return {
      setCtaButton:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },
})
