import "@testing-library/jest-dom";

// Supabase 환경변수 설정
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://your-test-project.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-test-anon-key";

// IntersectionObserver 모킹
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private callback: IntersectionObserverCallback) {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }

  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
