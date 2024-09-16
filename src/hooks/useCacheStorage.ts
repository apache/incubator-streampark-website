export function useCacheStorage<T = any>({
  expires = 24 * 60 * 60 * 1000,
} = {}) {
  // can be support sessionStorage or cookies
  const storage = window.localStorage;

  function setItem(key: string, value: T) {
    storage.setItem(
      key,
      JSON.stringify({
        data: value,
        expiresAt: Date.now() + expires,
      }),
    );
  }

  function getItem(key: string): T | null {
    const cached = storage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() < parsed.expiresAt) {
        return parsed.data;
      } else {
        console.log(11)
        storage.removeItem(key);
      }
    }
    return null;
  }

  return {
    setItem,
    getItem,
    clear: storage.clear,
  };
}
