import appConfig from '@/config';

export function warn(message: string) {
  console.warn(`[${appConfig.title} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${appConfig.title} error]:${message}`);
}
