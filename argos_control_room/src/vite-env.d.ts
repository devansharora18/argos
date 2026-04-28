export {};

declare global {
  interface Window {
    argosMeta?: {
      electron: string;
      chrome: string;
      platform: string;
    };
  }
}
