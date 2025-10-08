import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import i18n from "./i18n";

const options = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
};

// Handle Google OAuth redirect tokens from URL hash before app mounts
// Backend redirects to: FRONTEND_URL/#accessToken=...&refreshToken=...
(function captureOAuthTokensFromHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash || '';
  if (hash.startsWith('#')) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (accessToken) {
      try {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      } catch (_) {
        // ignore storage errors
      }
      // Clean the hash from the URL without reloading
      const { pathname, search } = window.location;
      window.history.replaceState({}, document.title, pathname + search);
    }
  }
})();

const app = createApp(App);

app.use(router);
app.use(i18n);
app.use(Toast, options);
app.mount("#app");
