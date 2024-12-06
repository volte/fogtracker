/// <reference types="vite/client" />

declare module '*.yml' {
  const src: string;
  export default src;
}

declare module '*.yaml' {
  const src: string;
  export default src;
}
