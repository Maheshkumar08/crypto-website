import { api } from './api'

export async function subscribeNewsletter(email, { source = 'blog' } = {}) {
  await api.post('/newsletter', { email, source })
}
