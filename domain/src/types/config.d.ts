export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko';

export interface GlobEnvConfig {
  VITE_APP_TITLE: string;
  VITE_API_URL: string;
  VITE_API_URL_PREFIX?: string;
  VITE_APP_SHORT_NAME: string;
  VITE_UPLOAD_URL?: string;
  VITE_APP_STORE_KEY: string;
  VITE_APP_ROUTE_MODE: string;
}
