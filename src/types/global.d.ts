// Image3D Global Type Definitions

declare global {
  interface Window {
    changeShape: (type: string) => void;
  }

  class GIF {
    constructor(options: any);
    addFrame(element: HTMLElement | CanvasImageSource, options?: any): void;
    on(event: string, callback: (data: any) => void): void;
    render(): void;
  }
}

export {};
