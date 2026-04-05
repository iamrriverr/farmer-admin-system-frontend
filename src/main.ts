// 全域樣式（包含 Tailwind + 自定義樣式 + 動畫）
import '@/assets/styles/main.css';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

async function bootstrap() {
  const app = createApp(App);

  // 1. 啟動 MSW (僅在開發環境且 VITE_USE_MOCK=true 時)
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
    const { worker } = await import('./mock/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // 對於非 API 請求（資源檔）直接放行
    });
    console.log('%c[MSW] Mocking enabled.', 'color: #3b82f6; font-weight: bold;');
  }

  // 2. Pinia
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);

  // 3. Mount
  app.use(pinia);
  app.use(router);
  app.mount('#app');
}

bootstrap();
