<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import MagneticButton from "../../components/ui/MagneticButton.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const fields = reactive({ email: "", password: "" });
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(fields.email, fields.password);
    router.push(route.query.redirect || { name: "admin-dashboard" });
  } catch (err) {
    // Never swallow the real reason — log it in full so it shows up in devtools.
    console.error("[auth] sign-in failed:", err.code, err.message, err);

    if (err.code === "database-unavailable" || err.code === "network-error") {
      error.value = "The server is not reachable or not configured yet — check MONGODB_URI in .env.";
    } else if (err.code === "rate-limited") {
      error.value = err.message;
    } else if (import.meta.env.DEV) {
      // Dev-only: show the real server error code instead of a generic
      // message, so misconfiguration (wrong project, disabled provider,
      // no such user) is obvious instead of looking like a typo.
      error.value = `${err.code || "unknown-error"} — ${err.message || "Sign-in failed."}`;
    } else {
      error.value = "Invalid email or password.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lift"
  >
    <div class="text-center">
      <div
        class="font-display text-xl font-semibold tracking-tight text-gray-900"
      >
        cryptolearner.us
      </div>
      <p class="mt-2 text-sm text-gray-500">
        Sign in to manage blogs and articles.
      </p>
    </div>

    <form class="mt-8 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="text-sm font-medium text-gray-700" for="email"
          >Email</label
        >
        <input
          id="email"
          v-model="fields.email"
          type="email"
          required
          class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="you@lumenledger.com"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-700" for="password"
          >Password</label
        >
        <input
          id="password"
          v-model="fields.password"
          type="password"
          required
          class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="••••••••"
        />
      </div>

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <MagneticButton as="button" type="submit" class="w-full">
        {{ loading ? "Signing in…" : "Sign in" }}
      </MagneticButton>
    </form>
  </div>
</template>
