class LocalStorageManager<T> {
  private storageKey: string;
  private defaultValue: T;

  constructor(storageKey: string, defaultValue: T) {
    this.storageKey = storageKey;
    this.defaultValue = defaultValue;
  }

  // 保存数据到 localStorage
  save(data: T): void {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(this.storageKey, jsonData);
  }

  // 从 localStorage 获取数据
  load(): T {
    const jsonData = localStorage.getItem(this.storageKey);
    if (jsonData) {
      return JSON.parse(jsonData) as T;
    }
    return this.defaultValue;
  }

  // 从 localStorage 删除数据
  remove(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export default LocalStorageManager;