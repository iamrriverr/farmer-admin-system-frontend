/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_API_URL?: string;
  // 在此添加其他環境變數
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
