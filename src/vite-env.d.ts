/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_ID: string;
  readonly VITE_PROXY_URL: string;
  readonly VITE_IMAGE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
