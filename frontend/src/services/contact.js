import { api } from './api'

export async function submitContactMessage({ name, email, subject, message }) {
  await api.post('/contact', { name, email, subject, message })
}
