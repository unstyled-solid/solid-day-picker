export function setTestTime(date: Date) {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  afterAll(() => {
    vi.useRealTimers();
  });
}
