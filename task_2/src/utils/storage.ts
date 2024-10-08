export enum StorageKey {
  LOCALE = 'locale',
  REPORT_ITEMS = 'reportItems',
}

export class StorageUtils {
  static get<T>(key: StorageKey): T | null {
    let data
    if (typeof window !== 'undefined') {
      data = localStorage.getItem(key)
    }
    if (data == null) return null
    const cached = JSON.parse(data)
    return cached
  }

  static set<T>(key: string, value: T): T {
    const cached = JSON.stringify(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, cached)
    }
    return value
  }

  static remove(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }
}
