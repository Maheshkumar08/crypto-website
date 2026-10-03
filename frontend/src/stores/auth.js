import { defineStore } from 'pinia'
import { api, refreshSession, setAccessToken } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    init() {
      return this.ensureLoaded()
    },
    /** Restores the session from the refresh cookie once per page load. */
    async ensureLoaded() {
      if (this.ready) return this.user
      try {
        const session = await refreshSession()
        this.user = session.user
      } catch {
        this.user = null
      }
      this.ready = true
      return this.user
    },
    async login(email, password) {
      // Trim the email only — whitespace in a pasted address is a common,
      // silent cause of "invalid credential." The password is passed through
      // untouched, since trimming it could alter an intentionally-set value.
      const session = await api.post('/auth/login', { email: email.trim(), password })
      setAccessToken(session.accessToken)
      this.user = session.user
      this.ready = true
      return session.user
    },
    async logout() {
      try {
        await api.post('/auth/logout')
      } finally {
        setAccessToken(null)
        this.user = null
      }
    },
  },
})
